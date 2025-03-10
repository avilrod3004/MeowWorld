import { createWebHistory, createRouter } from 'vue-router'
import Login from "../pages/Login.vue";
import Profile from "../pages/Profile.vue";
import PrivateLayout from "../layouts/PrivateLayout.vue";
import PublicLayout from "../layouts/PublicLayout.vue";
import Register from "../pages/Register.vue";
import NotFound from "../pages/NotFound.vue";
import Home from "../pages/Home.vue";
import Search from "../pages/Search.vue";
import NewPost from "../pages/NewPost.vue";
import Chats from "../pages/Chats.vue";
import Notifications from "../pages/Notifications.vue";

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
        path: '/home',
        component: PrivateLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Home',
                component: Home,
            }
        ]
    },
    {
        path: '/search',
        component: PrivateLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Search',
                component: Search,
            }
        ]
    },
    {
        path: '/newpost',
        component: PrivateLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'NewPost',
                component: NewPost,
            }
        ]
    },
    {
        path: '/chats',
        component: PrivateLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Chats',
                component: Chats,
            }
        ]
    },
    {
        path: '/notifications',
        component: PrivateLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Notifications',
                component: Notifications,
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