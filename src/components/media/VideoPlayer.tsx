import { Play } from "lucide-react";
import { useState } from "react";

export type VideoSettings = {
  url: string;
  kind?: string | null;
  poster?: string | null;
  captions?: string | null;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  title?: string;
};

export function embedUrl(url: string): string | null {
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export function isVideoUrl(url?: string | null) {
  return Boolean(url && url.trim().length > 0);
}

/** Brand-styled video player: dark surface, champagne-gold controls, lazy loaded. */
export function VideoPlayer({
  url,
  kind,
  poster,
  captions,
  autoplay = false,
  muted = true,
  loop = false,
  controls = true,
  title = "Video",
}: VideoSettings) {
  const [activated, setActivated] = useState(autoplay);
  const embed = kind === "file" ? null : embedUrl(url);

  if (embed) {
    return (
      <figure className="video-frame">
        {activated ? (
          <iframe
            src={`${embed}?autoplay=1${muted ? "&muted=1" : ""}${loop ? "&loop=1" : ""}`}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full rounded-md border border-gold-soft bg-black"
          />
        ) : (
          <button
            type="button"
            onClick={() => setActivated(true)}
            className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border border-gold-soft bg-black"
            aria-label={`Play video: ${title}`}
          >
            {poster && (
              <img
                src={poster}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-70 transition group-hover:opacity-90"
              />
            )}
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gold text-ink shadow-[var(--shadow-luxe)] transition group-hover:scale-110">
              <Play className="h-6 w-6" aria-hidden />
            </span>
          </button>
        )}
      </figure>
    );
  }

  return (
    <figure className="video-frame">
      <video
        className="aspect-video w-full rounded-md border border-gold-soft bg-black"
        {...(poster ? { poster } : {})}
        controls={controls}
        autoPlay={autoplay}
        muted={autoplay ? true : muted}
        loop={loop}
        playsInline
        preload="none"
      >
        <source src={url} />
        {captions && <track kind="captions" src={captions} srcLang="en" label="English" default />}
        Your browser does not support embedded video.
      </video>
    </figure>
  );
}
