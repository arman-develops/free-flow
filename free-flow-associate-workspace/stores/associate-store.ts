import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { Associate, Notification } from "@/types/associate"

interface AssociateState {
  // Associate Profile
  associate: Associate | null
  setAssociate: (associate: Associate | null) => void
  updateAssociate: (updates: Partial<Associate>) => void

  // Notifications
  notifications: Notification[]
  unreadCount: number
  setNotifications: (notifications: Notification[]) => void
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  addNotification: (notification: Notification) => void

  // UI State
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  // Auth State
  isAuthenticated: boolean
  setIsAuthenticated: (isAuthenticated: boolean) => void
  logout: () => void
}

export const useAssociateStore = create<AssociateState>()(
  devtools(
    persist(
      (set) => ({
        // Associate Profile
        associate: null,
        setAssociate: (associate) => set({ associate }),
        updateAssociate: (updates) =>
          set((state) => ({
            associate: state.associate ? { ...state.associate, ...updates } : null,
          })),

        // Notifications
        notifications: [],
        unreadCount: 0,
        setNotifications: (notifications) =>
          set({
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
          }),
        markNotificationAsRead: (id) =>
          set((state) => {
            const notifications = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
            return {
              notifications,
              unreadCount: notifications.filter((n) => !n.read).length,
            }
          }),
        markAllNotificationsAsRead: () =>
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
          })),
        addNotification: (notification) =>
          set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1,
          })),

        // UI State
        sidebarCollapsed: false,
        toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

        // Auth State
        isAuthenticated: false,
        setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        logout: () =>
          set({
            associate: null,
            isAuthenticated: false,
            notifications: [],
            unreadCount: 0,
          }),
      }),
      {
        name: "freeflow-associate-storage",
        partialize: (state) => ({
          associate: state.associate,
          sidebarCollapsed: state.sidebarCollapsed,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
  ),
)
