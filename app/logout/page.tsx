import type { Metadata } from "next";

import { LogoutPageClient } from "@/components/auth/logout-page-client";

export const metadata: Metadata = {
  title: "خروج | استاک سیگنال",
};

export default function LogoutPage() {
  return <LogoutPageClient />;
}
