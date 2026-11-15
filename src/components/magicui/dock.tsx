import { cn } from "@/lib/utils";
import { useRef, type MouseEvent, type ReactNode } from "react";

interface DockProps {
  className?: string;
  children: ReactNode;
  magnification?: number;
  distance?: number;
}

interface DockIconProps {
  className?: string;
  children?: ReactNode;
}

const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 100;
const BASE_SIZE = 40;
const BASE_ICON_SIZE = 20;
const ICON_SIZE_RATIO = 0.5;

const Dock = ({ className, children, magnification = DEFAULT_MAGNIFICATION, distance = DEFAULT_DISTANCE }: DockProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const icons = () => ref.current?.querySelectorAll<HTMLElement>("[data-dock-icon]") ?? [];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (const icon of icons()) {
      const bounds = icon.getBoundingClientRect();
      const offset = Math.abs(e.clientX - bounds.x - bounds.width / 2);
      const proximity = Math.max(0, 1 - offset / distance);
      icon.style.setProperty("--dock-size", `${BASE_SIZE + (magnification - BASE_SIZE) * proximity}px`);
      icon.style.setProperty(
        "--dock-icon-size",
        `${BASE_ICON_SIZE + (magnification * ICON_SIZE_RATIO - BASE_ICON_SIZE) * proximity}px`
      );
    }
  };

  const handleMouseLeave = () => {
    for (const icon of icons()) {
      icon.style.removeProperty("--dock-size");
      icon.style.removeProperty("--dock-icon-size");
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("mx-auto w-max h-full flex items-end justify-center overflow-visible rounded-full border", className)}
    >
      {children}
    </div>
  );
};

const DockIcon = ({ className, children }: DockIconProps) => (
  <div
    data-dock-icon
    style={{ width: "var(--dock-size, 40px)", height: "var(--dock-size, 40px)" }}
    className={cn("dock-icon relative flex aspect-square items-center justify-center rounded-full shrink-0", className)}
  >
    <div
      style={{ width: "var(--dock-icon-size, 20px)", height: "var(--dock-icon-size, 20px)" }}
      className="dock-icon-inner flex items-center justify-center"
    >
      {children}
    </div>
  </div>
);

export { Dock, DockIcon };
export type { DockProps, DockIconProps };
