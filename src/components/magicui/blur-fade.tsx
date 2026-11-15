import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

interface BlurFadeProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  yOffset?: number;
  blur?: string;
}

const BlurFade = ({
  children,
  className,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  blur = "6px",
}: BlurFadeProps) => (
  <div
    className={cn("blur-fade", className)}
    style={
      {
        "--blur-fade-delay": `${0.04 + delay}s`,
        "--blur-fade-duration": `${duration}s`,
        "--blur-fade-y": `${-yOffset}px`,
        "--blur-fade-blur": blur,
      } as CSSProperties
    }
  >
    {children}
  </div>
);

export default BlurFade;
