import { cn } from "@/lib/utils";
import { useMemo, type CSSProperties } from "react";

interface BlurFadeTextProps {
  text: string;
  className?: string;
  duration?: number;
  characterDelay?: number;
  delay?: number;
  yOffset?: number;
  animateByCharacter?: boolean;
}

const blurFadeVars = (delay: number, duration: number, yOffset: number) =>
  ({
    "--blur-fade-delay": `${delay}s`,
    "--blur-fade-duration": `${duration}s`,
    "--blur-fade-y": `${-yOffset}px`,
    "--blur-fade-blur": "8px",
  }) as CSSProperties;

const BlurFadeText = ({
  text,
  className,
  duration = 0.4,
  characterDelay = 0.03,
  delay = 0,
  yOffset = 8,
  animateByCharacter = false,
}: BlurFadeTextProps) => {
  const characters = useMemo(() => Array.from(text), [text]);

  if (animateByCharacter) {
    return (
      <div className="flex">
        {characters.map((char, i) => (
          <span
            key={i}
            className={cn("inline-block blur-fade", className)}
            style={{
              ...blurFadeVars(delay + i * characterDelay, duration, yOffset),
              width: char.trim() === "" ? "0.2em" : "auto",
            }}
          >
            {char}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex">
      <span
        className={cn("inline-block blur-fade", className)}
        style={blurFadeVars(delay, duration, yOffset)}
      >
        {text}
      </span>
    </div>
  );
};

export default BlurFadeText;
