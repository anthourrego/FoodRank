import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface StateAuthStore {
  isLogged: boolean;
  userName: string | null;
  userId: string | null;
  token: string | null;
  config: string | null;
}

interface Action {
  updateConfig: (config: string) => void;

  onLoginUser: ({
    userName,
    userId,
    token,
  }: {
    userName: string;
    userId: string;
    token: string;
  }) => void;
  onLogout: () => void;
  onLoadConfig: (dataConfig: Partial<StateAuthStore>) => void;
}

export const useAuthStore = create<StateAuthStore & Action>()(
  persist(
    (set) => ({
      isLogged: false,
      userName: null,
      userId: null,
      token: null,
      config: null,

      updateConfig: async (config: string) => {
        set({ config });
      },
      updateToken: async (token: string) => {
        set({ token });
      },

      onLoginUser: ({
        userName,
        userId,
        token,
      }: {
        userName: string;
        userId: string;
        token: string;
      }) => {
        set({ userName, userId, token, isLogged: true });
      },
      onLogout: () => {
        set({
          userName: null,
          userId: null,
          token: null,
          isLogged: false,
          config: null,
        });
      },
      onLoadConfig: (dataConfig: Partial<StateAuthStore>) => {
        set((state) => ({
          ...state,
          ...(dataConfig.config !== undefined && { config: dataConfig.config }),
          ...(dataConfig.isLogged !== undefined && {
            isLogged: dataConfig.isLogged,
          }),
          ...(dataConfig.userName !== undefined && {
            userName: dataConfig.userName,
          }),
          ...(dataConfig.userId !== undefined && { userId: dataConfig.userId }),
          ...(dataConfig.token !== undefined && { token: dataConfig.token }),
        }));
      },
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({
        isLogged: state.isLogged,
        userName: state.userName,
        userId: state.userId,
        token: state.token,
        config: state.config,
      }),
    }
  )
);
