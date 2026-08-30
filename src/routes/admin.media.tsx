import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceManager, type FieldDef } from "@/components/admin/ResourceManager";
import { supabase } from "@/integrations/supabase/client";
import { adminSave } from "@/lib/admin.functions";

const SIGNED_URL_TTL = 60 * 60 * 24 * 365;

const fields: FieldDef[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "url", label: "URL", type: "text" },
  { name: "storage_path", label: "Storage path", type: "text" },
  { name: "kind", label: "Kind", type: "select", options: ["image", "video", "document"] },
  { name: "alt_text", label: "Alt text", type: "text", hint: "Required for accessibility and SEO" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "mime_type", label: "MIME type", type: "text" },
];

function Uploader() {
  const queryClient = useQueryClient();
  const save = useServerFn(adminSave);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const record = useMutation({
    mutationFn: async (row: Record<string, string | number | null>) =>
      save({ data: { table: "media_library", id: null, row } }),
    onSuccess: () => {
      toast.success("Upload added to the media library");
      void queryClient.invalidateQueries({ queryKey: ["admin", "media_library"] });
    },
    onError: (error: Error) => toast.error(error.message || "Could not save media record"),
  });

  async function onFile(file: File) {
    setBusy(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80);
      const path = `uploads/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(path, file, { upsert: false });
      if (uploadError) throw new Error(uploadError.message);
      const { data: signed, error: signError } = await supabase.storage
        .from("media")
        .createSignedUrl(path, SIGNED_URL_TTL);
      if (signError || !signed) throw new Error(signError?.message ?? "Could not create media URL");
      record.mutate({
        title: file.name,
        url: signed.signedUrl,
        storage_path: path,
        kind: file.type.startsWith("video") ? "video" : file.type.startsWith("image") ? "image" : "document",
        alt_text: "",
        mime_type: file.type,
        size_bytes: file.size,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="luxe-card mb-8 p-6">
      <h2 className="font-display text-[12px] tracking-[0.22em] uppercase">Upload media</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        Upload images or video, then add alt text below. Files are stored privately and served through a signed URL.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*,application/pdf"
        aria-label="Choose a file to upload"
        disabled={busy}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void onFile(file);
        }}
        className="mt-5 block w-full text-sm"
      />
      {busy && <p className="mt-3 text-xs text-muted-foreground">Uploading…</p>}
    </div>
  );
}

export const Route = createFileRoute("/admin/media")({
  head: () => ({
    meta: [
      { title: "Media Library | JointHeirs Admin" },
      { name: "description", content: "Upload and manage site images and video." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell title="Media Library" description="Upload imagery and video, then reuse the URLs across the site.">
      <Uploader />
      <ResourceManager table="media_library" fields={fields} titleField="title" subtitleField="kind" />
    </AdminShell>
  ),
});
