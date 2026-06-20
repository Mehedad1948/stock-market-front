export const PERMISSIONS = {
  PORTFOLIO_READ: "portfolio:read",
  SECURITY_MANAGE: "security:manage",
  TRANSFER_CREATE: "transfer:create"
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export function hasPermission(
  grantedPermissions: readonly Permission[],
  requiredPermission: Permission
) {
  return grantedPermissions.includes(requiredPermission);
}
