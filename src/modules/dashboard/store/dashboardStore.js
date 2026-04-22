import { defineStore } from "pinia"

export const useDashboardStore = defineStore(
  "dashboard",

  {
    state: () => ({
      month: "Tháng 5, 2024"
    }),

    actions: {

      setMonth(m) {
        this.month = m
      }

    }
  }
)