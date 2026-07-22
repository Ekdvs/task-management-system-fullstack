import { cx } from "../lib/utils";


export default function Loader({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex items-center justify-center gap-2 py-12 text-sm text-ink-muted",
        className
      )}
      role="status"
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-brand" />
      {label}
    </div>
  );
}
