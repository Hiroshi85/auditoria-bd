import { cn } from "@/lib/utils";
interface ResultsProps {
  children: React.ReactNode;
  className?: string;
  type?: "error" | "ok";
}
export function ResultContainer({
  children,
  className,
  type,
}: ResultsProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-accent w-full rounded-lg p-4 border",
        type === "ok"
          ? "border-green-500 bg-white"
          : type === "error"
          ? "border-red-500 bg-red-100"
          : "",
        className
      )}
    >
      {children}
    </div>
  );
}
