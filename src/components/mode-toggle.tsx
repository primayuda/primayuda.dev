import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ModeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, systemTheme, setTheme } = useTheme();

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
    if (meta) meta.content = theme === "light" || theme === "dark" ? theme : "light dark";
  }, [theme]);

  const toggle = () => {
    const target = resolvedTheme === "dark" ? "light" : "dark";
    // Toggling back to what the OS already shows clears the override instead of pinning it.
    setTheme(target === systemTheme ? "system" : target);
  };

  return (
    <Button
      type="button"
      variant="link"
      size="icon"
      className={cn(className)}
      onClick={toggle}
    >
      <SunIcon className="hidden h-full w-full dark:block" aria-hidden />
      <MoonIcon className="h-full w-full dark:hidden" aria-hidden />
      <span className="sr-only dark:hidden">Switch to dark theme</span>
      <span className="sr-only hidden dark:inline">Switch to light theme</span>
    </Button>
  );
}
