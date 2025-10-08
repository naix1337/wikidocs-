import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface InviteCode {
  id: string;
  code: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  expiresAt?: string;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
  usedBy: Array<{
    userId: string;
    userName: string;
    usedAt: string;
  }>;
  description?: string;
}

interface InviteCodeStore {
  inviteCodes: InviteCode[];
  
  // Actions
  generateInviteCode: (createdBy: string, createdByName: string, options?: {
    expiresAt?: string;
    maxUses?: number;
    description?: string;
  }) => InviteCode;
  
  validateInviteCode: (code: string) => { valid: boolean; inviteCode?: InviteCode; error?: string };
  useInviteCode: (code: string, userId: string, userName: string) => boolean;
  deactivateInviteCode: (codeId: string) => void;
  deleteInviteCode: (codeId: string) => void;
  
  // Getters
  getActiveInviteCodes: () => InviteCode[];
  getInviteCodeStats: () => {
    total: number;
    active: number;
    expired: number;
    used: number;
    totalUses: number;
  };
}

const generateRandomCode = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const useInviteCodeStore = create<InviteCodeStore>()(
  persist(
    (set, get) => ({
      inviteCodes: [],

      generateInviteCode: (createdBy: string, createdByName: string, options = {}) => {
        const newInviteCode: InviteCode = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          code: generateRandomCode(),
          createdBy,
          createdByName,
          createdAt: new Date().toISOString(),
          expiresAt: options.expiresAt,
          maxUses: options.maxUses,
          currentUses: 0,
          isActive: true,
          usedBy: [],
          description: options.description,
        };

        set(state => ({
          inviteCodes: [...state.inviteCodes, newInviteCode]
        }));

        return newInviteCode;
      },

      validateInviteCode: (code: string) => {
        const inviteCode = get().inviteCodes.find(ic => ic.code === code);
        
        if (!inviteCode) {
          return { valid: false, error: 'Invite code not found' };
        }

        if (!inviteCode.isActive) {
          return { valid: false, error: 'Invite code is deactivated' };
        }

        if (inviteCode.expiresAt && new Date() > new Date(inviteCode.expiresAt)) {
          return { valid: false, error: 'Invite code has expired' };
        }

        if (inviteCode.maxUses && inviteCode.currentUses >= inviteCode.maxUses) {
          return { valid: false, error: 'Invite code has reached maximum uses' };
        }

        return { valid: true, inviteCode };
      },

      useInviteCode: (code: string, userId: string, userName: string) => {
        const validation = get().validateInviteCode(code);
        
        if (!validation.valid || !validation.inviteCode) {
          return false;
        }

        set(state => ({
          inviteCodes: state.inviteCodes.map(ic => 
            ic.code === code 
              ? {
                  ...ic,
                  currentUses: ic.currentUses + 1,
                  usedBy: [...ic.usedBy, {
                    userId,
                    userName,
                    usedAt: new Date().toISOString()
                  }]
                }
              : ic
          )
        }));

        return true;
      },

      deactivateInviteCode: (codeId: string) => {
        set(state => ({
          inviteCodes: state.inviteCodes.map(ic =>
            ic.id === codeId ? { ...ic, isActive: false } : ic
          )
        }));
      },

      deleteInviteCode: (codeId: string) => {
        set(state => ({
          inviteCodes: state.inviteCodes.filter(ic => ic.id !== codeId)
        }));
      },

      getActiveInviteCodes: () => {
        return get().inviteCodes.filter(ic => {
          if (!ic.isActive) return false;
          if (ic.expiresAt && new Date() > new Date(ic.expiresAt)) return false;
          if (ic.maxUses && ic.currentUses >= ic.maxUses) return false;
          return true;
        });
      },

      getInviteCodeStats: () => {
        const codes = get().inviteCodes;
        const now = new Date();
        
        return {
          total: codes.length,
          active: codes.filter(ic => ic.isActive).length,
          expired: codes.filter(ic => ic.expiresAt && now > new Date(ic.expiresAt)).length,
          used: codes.filter(ic => ic.maxUses && ic.currentUses >= ic.maxUses).length,
          totalUses: codes.reduce((sum, ic) => sum + ic.currentUses, 0)
        };
      },
    }),
    {
      name: 'invite-codes-storage',
    }
  )
);

// Initialize with some demo invite codes for development
if (typeof window !== 'undefined') {
  const store = useInviteCodeStore.getState();
  if (store.inviteCodes.length === 0) {
    // Create a default admin invite code
    store.generateInviteCode('admin', 'System Administrator', {
      description: 'Default admin invite code',
      maxUses: 10
    });
  }
}