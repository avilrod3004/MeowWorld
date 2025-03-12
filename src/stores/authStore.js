import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        getToken: (state) => state.token,
    },

    actions: {
        setToken(token) {
            this.token = token;
        },
        loadToken() {
            this.token = localStorage.getItem("token");
        },
        logout() {
            this.token = null;
            // localStorage.removeItem("token");
        }
    },

    persist: {
        enabled: true,
        strategies: [
            {
                key: "token",
                storage: localStorage,
            }
        ]
    }
})
