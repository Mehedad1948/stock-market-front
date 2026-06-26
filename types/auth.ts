import type { AuthenticatedUser } from "@/types/frontend-api.types";

import type { Permission } from "@/lib/auth/permissions";

export type Session = {
  accountId: string;
  authenticatedAt: string;
  displayName: string;
  expiresAt: string | null;
  identifier: string;
  permissions: Permission[];
  session:
    | {
        createdAt: string;
        expiresAt: string;
        id: string;
      }
    | null;
  user: AuthenticatedUser;
  userId: string;
};
