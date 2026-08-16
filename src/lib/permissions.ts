export enum Role {
  GOD = 'god',
  OWNER = 'owner',
  SELLER = 'seller',
  USER = 'user',
}

export interface UserContext {
  id: number;
  username: string;
  role: Role;
}

export class PermissionChecker {
  static canAccessAdmin(role: string): boolean {
    return role === Role.GOD || role === Role.OWNER;
  }

  static canManageKeys(role: string): boolean {
    return role === Role.GOD || role === Role.OWNER || role === Role.SELLER;
  }

  static canManageCheats(role: string): boolean {
    return role === Role.GOD || role === Role.OWNER;
  }

  static canManageBans(role: string): boolean {
    return role === Role.GOD || role === Role.OWNER || role === Role.SELLER;
  }

  static canViewLogs(role: string): boolean {
    return role === Role.GOD || role === Role.OWNER || role === Role.SELLER;
  }

  static canManageUsers(role: string): boolean {
    return role === Role.GOD;
  }

  static canManageLoaders(role: string): boolean {
    return role === Role.GOD || role === Role.OWNER;
  }

  static canManageOwners(role: string): boolean {
    return role === Role.GOD;
  }

  static canManageSellers(role: string): boolean {
    return role === Role.GOD || role === Role.OWNER;
  }

  static canViewProfile(role: string): boolean {
    return true; // All authenticated users can view their profile
  }
}

export const getRoleDisplay = (role: string): string => {
  const roleMap: Record<string, string> = {
    god: 'Administrator',
    owner: 'Program Owner',
    seller: 'Reseller',
    user: 'User',
  };
  return roleMap[role] || 'Unknown';
};
