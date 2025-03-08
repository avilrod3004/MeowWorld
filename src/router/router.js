import { createWebHistory, createRouter } from 'vue-router'
import Login from "../pages/Login.vue";
import Profile from "../pages/Profile.vue";
import PrivateLayout from "../layouts/PrivateLayout.vue";
import PublicLayout from "../layouts/PublicLayout.vue";
import Register from "../pages/Register.vue";
import NotFound from "../pages/NotFound.vue";

const routes = [
    {
        path: "/",
        component: PublicLayout,
        children: [
            {
                path: "",
                name: "Login",
                component: Login,
            },
            {
                path: "/register",
                name: "Register",
                component: Register,
            }
        ]
    },
    {
        path: '/profile',
        component: PrivateLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Profile',
                component: Profile,
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        component: NotFound,
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
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    if (to.meta.requiresAuth && !token) {
        next('/');
    } else {
        next();
    }
});

export default router;