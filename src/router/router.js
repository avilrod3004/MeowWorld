import { createWebHistory, createRouter } from 'vue-router'
import Login from "../pages/Login.vue";
import Profile from "../pages/Profile.vue";

const routes = [
    {
        path: "/",
        component: Login
    },
    {
        path: "/profile",
        component: Profile
    }
    // {
    //     path: "/about",
    //     component: () => import('../modules/pokemon/pages/AboutPage.vue')
    // },
    // {
    //     path: "/:id",
    //     name: "pokemonId",
    //     component: () => import('../modules/pokemon/pages/Pokemon.vue'),
    //     // opcion 2
    //     props: (route) => {
    //         console.log(route)
    //         const {id} = route.params
    //         return {
    //             id,
    //         }
    //     }
    // },
    // {
    //     path: "/:pathMatch(.*)*",
    //     component: () => import('../modules/pokemon/pages/NoPageFound.vue')
    // }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;