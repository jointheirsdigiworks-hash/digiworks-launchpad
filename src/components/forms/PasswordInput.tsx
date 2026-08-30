import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  /** Extra classes merged onto the input itself. */
  className?: string;
};

/**
 * Password field with an accessible reveal toggle. Use this everywhere a
 * password is entered so the behaviour stays identical site-wide.
 */
export function PasswordInput({ className, id, ...props }: Props) {
  const [visible, setVisible] = useState(false);
  const fallbackId = useId();
  const inputId = id ?? fallbackId;

  return (
    <div className="relative">
      <input
        {...props}
        id={inputId}
        type={visible ? "text" : "password"}
        className={cn(
          "mt-2 w-full rounded-md border border-input bg-background/60 px-4 py-3 pr-12 text-sm outline-none focus:border-gold",
          className,
        )}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        aria-controls={inputId}
        className="absolute top-1/2 right-2 mt-1 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-gold focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
      >
        {visible ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
      </button>
    </div>
  );
}
