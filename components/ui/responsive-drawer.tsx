"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

function ResponsiveDrawer({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="responsive-drawer" {...props} />;
}

function ResponsiveDrawerTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return (
    <DialogPrimitive.Trigger
      data-slot="responsive-drawer-trigger"
      {...props}
    />
  );
}

function ResponsiveDrawerPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return (
    <DialogPrimitive.Portal
      data-slot="responsive-drawer-portal"
      {...props}
    />
  );
}

function ResponsiveDrawerClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close data-slot="responsive-drawer-close" {...props} />
  );
}

function ResponsiveDrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="responsive-drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/28 backdrop-blur-[2px]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

function ResponsiveDrawerContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <ResponsiveDrawerPortal>
      <ResponsiveDrawerOverlay />
      <DialogPrimitive.Content
        data-slot="responsive-drawer-content"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[88vh] flex-col overflow-hidden rounded-t-[2rem] border border-white/70 bg-white/96 shadow-[0_-24px_60px_-32px_rgba(15,23,42,0.45)] duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:slide-out-to-bottom-8 data-[state=open]:slide-in-from-bottom-8",
          "sm:right-0 sm:left-auto sm:h-screen sm:max-h-screen sm:w-full sm:max-w-3xl sm:rounded-none sm:rounded-l-[2rem] sm:border-y-0 sm:border-r-0 sm:shadow-[-24px_0_60px_-32px_rgba(15,23,42,0.35)]",
          "sm:data-[state=closed]:slide-out-to-right-8 sm:data-[state=open]:slide-in-from-right-8",
          className,
        )}
        {...props}
      >
        <div className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-black/10 sm:hidden" />
        {children}
        {showCloseButton ? (
          <ResponsiveDrawerClose
            className="absolute top-4 left-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/8 bg-white/80 text-black/55 transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="بستن"
          >
            <X className="h-4 w-4" />
          </ResponsiveDrawerClose>
        ) : null}
      </DialogPrimitive.Content>
    </ResponsiveDrawerPortal>
  );
}

function ResponsiveDrawerHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="responsive-drawer-header"
      className={cn("flex flex-col gap-2 text-right", className)}
      {...props}
    />
  );
}

function ResponsiveDrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="responsive-drawer-title"
      className={cn("text-lg font-semibold tracking-[-0.02em] text-black", className)}
      {...props}
    />
  );
}

function ResponsiveDrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="responsive-drawer-description"
      className={cn("text-sm leading-6 text-black/58", className)}
      {...props}
    />
  );
}

export {
  ResponsiveDrawer,
  ResponsiveDrawerClose,
  ResponsiveDrawerContent,
  ResponsiveDrawerDescription,
  ResponsiveDrawerHeader,
  ResponsiveDrawerPortal,
  ResponsiveDrawerTitle,
  ResponsiveDrawerTrigger,
};
