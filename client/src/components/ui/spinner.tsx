import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

export const Spinner = (
  { className, size }: { className?: string; size?: number } = {
    className: "",
    size: 30,
  }
) => {
  return (
    <Loader
      className={cn(
        "motion-safe:animate-[spin_2s_ease-in-out_infinite] text-[#0F172A]",
        className
      )}
      size={size}
    />
  );
};

export default Spinner;