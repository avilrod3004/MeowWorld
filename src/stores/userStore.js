import { defineStore } from "pinia"

export const useUserStore = defineStore("user", {
    state: () => ({
        user: null,
    }),

    getters: {
        getUser: (state) => state.user,
    },

    actions: {
        setUser(user) {
            this.user = user;
        },
        logout() {
            this.user = null;
            localStorage.removeItem("user");
        }
    },

    persist: {
        enabled: true,
        strategies: [
            {
                key: "user",
                storage: localStorage, // Solo guarda los datos del usuario
            }
        ]
    }
})
