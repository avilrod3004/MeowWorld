import { createWebHistory, createRouter } from 'vue-router'
import Login from "../pages/Login.vue";
import UserProfile from "../pages/UserProfile.vue";
import PrivateLayout from "../layouts/PrivateLayout.vue";
import PublicLayout from "../layouts/PublicLayout.vue";
import Register from "../pages/Register.vue";
import NotFound from "../pages/NotFound.vue";
import Home from "../pages/Home.vue";
import Search from "../pages/Search.vue";
import NewPost from "../pages/NewPost.vue";
import Chats from "../pages/Chats.vue";
import Notifications from "../pages/Notifications.vue";
import CatProfile from "../pages/CatProfile.vue";
import InfoPost from "../pages/InfoPost.vue";
import EditUserProfile from "../pages/EditUserProfile.vue";
import EditCatProfile from "../pages/EditCatProfile.vue";
import Settings from "../pages/Settings.vue";
import NewCat from "../pages/NewCat.vue";
import OtherUserProfile from "../pages/OtherUserProfile.vue";

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
                component: () => import("../pages/Register.vue"),
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
                component: () => import("../pages/Home.vue"),
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
                component: () => import("../pages/Search.vue"),
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
                component: () => import("../pages/NewPost.vue"),
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
                component: () => import("../pages/Chats.vue"),
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
                component: () => import("../pages/Notifications.vue"),
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
                name: 'UserProfile',
                component: () => import("../pages/UserProfile.vue"),
            }
        ]
    },
    {
        path: '/profile/edit',
        component: PrivateLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'EditUserProfile',
                component: () => import("../pages/EditUserProfile.vue"),
            }
        ]
    },
    {
        path: '/cat/new',
        component: PrivateLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'NewCat',
                component: () => import("../pages/NewCat.vue"),
            }
        ]
    },
    {
        path: '/cat/:id',
        component: PrivateLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'CarId',
                component: () => import("../pages/CatProfile.vue"),
                props: (route) => {
                    const { id } = route.params;
                    return {
                        id
                    }
                }
            }
        ]
    },
    {
        path: '/cat/edit/:id',
        component: PrivateLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'EditCatProfile',
                component: () => import('../pages/EditCatProfile.vue'),
            }
        ]
    },
    {
        path: '/post/:id',
        component: PrivateLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'InfoPost',
                component: () => import('../pages/InfoPost.vue'),
            }
        ]
    },
    {
        path: '/user/:id',
        component: PrivateLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'OtherUserProfile',
                component: () => import('../pages/OtherUserProfile.vue'),
            }
        ]
    },
    {
        path: '/settings',
        component: PrivateLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Settings',
                component: () => import("../pages/Settings.vue"),
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import("../pages/NotFound.vue"),
    }
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