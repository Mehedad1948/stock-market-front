"use client";

import { useEffect, useRef } from "react";
import { ArrowUpLeft } from "lucide-react";

import { cn } from "@/lib/utils";

type HeroCursorHeadingProps = {
  labels: string[];
  className?: string;
};

export function HeroCursorHeading({
  labels,
  className,
}: HeroCursorHeadingProps) {
  const regionRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  function hideCursor() {
    if (!cursorRef.current) {
      return;
    }

    cursorRef.current.style.opacity = "0";
  }

  function updateCursor(clientX: number, clientY: number) {
    const region = regionRef.current;
    const cursor = cursorRef.current;
    const label = labelRef.current;

    if (!region || !cursor || !label) {
      return;
    }

    const bounds = region.getBoundingClientRect();
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;

    const nextLabelIndex = Math.min(
      labels.length - 1,
      Math.max(0, Math.floor((x / Math.max(bounds.width, 1)) * labels.length)),
    );

    label.textContent = labels[nextLabelIndex] ?? labels[0] ?? "";
    cursor.style.opacity = "1";
    cursor.style.transform = `translate3d(${x - 132}px, ${y - 22}px, 0)`;
  }

  function handlePointerEnter(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") {
      return;
    }

    updateCursor(event.clientX, event.clientY);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") {
      return;
    }

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    const { clientX, clientY } = event;
    frameRef.current = requestAnimationFrame(() => {
      updateCursor(clientX, clientY);
      frameRef.current = null;
    });
  }

  function handlePointerLeave() {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    hideCursor();
  }

  return (
    <div
      ref={regionRef}
      className={cn("relative mx-auto max-w-5xl", className)}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 hidden rounded-full border border-foreground/10 bg-white/94 px-3 py-2 opacity-0 transition-opacity duration-200 will-change-transform md:flex md:items-center md:gap-2"
      >
        <ArrowUpLeft className="h-4 w-4 text-brand-500" />
        <span ref={labelRef} className="text-sm font-semibold text-foreground">
          {labels[0]}
        </span>
      </div>

      <h1 className="text-balance text-right text-5xl font-semibold leading-[1.05] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-8xl">
        برای هر تصمیم بازار،
        <span className="mt-3 block text-foreground/92">یک سیگنال روشن داشته باشید</span>
      </h1>
    </div>
  );
}
