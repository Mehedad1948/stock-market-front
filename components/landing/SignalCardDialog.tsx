"use client";

import type { ReactNode } from "react";

import {
  ResponsiveDrawer,
  ResponsiveDrawerContent,
  ResponsiveDrawerDescription,
  ResponsiveDrawerHeader,
  ResponsiveDrawerTitle,
  ResponsiveDrawerTrigger,
} from "@/components/ui/responsive-drawer";

type SignalCardDialogProps = {
  trigger: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
};

export function SignalCardDialog({
  trigger,
  title,
  description,
  children,
}: SignalCardDialogProps) {
  return (
    <ResponsiveDrawer>
      <ResponsiveDrawerTrigger asChild>{trigger}</ResponsiveDrawerTrigger>
      <ResponsiveDrawerContent
        dir="rtl"
        className="p-0"
      >
        <div className="border-b border-black/6 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
          <ResponsiveDrawerHeader>
            <ResponsiveDrawerTitle>{title}</ResponsiveDrawerTitle>
            <ResponsiveDrawerDescription>
              {description}
            </ResponsiveDrawerDescription>
          </ResponsiveDrawerHeader>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6">
          {children}
        </div>
      </ResponsiveDrawerContent>
    </ResponsiveDrawer>
  );
}
