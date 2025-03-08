<template>
<div v-if="user">
    <img :src="userImProfile" alt="" class="img-profile">
    <p>{{ userName }}</p>
    <p>@{{ userUsername}}</p>
    <p>{{ userDescription }}</p>

    <ul>
        <li>seguidores</li>
        <li>seguidos</li>
        <li v-if="cats">{{ cats.length }} gatos</li>
    </ul>

    <ul v-if="cats">
        <li v-if="cats.length === 0">No tienes ningún gatito registrado :(</li>

        <li
            v-for="cat in cats"
            :key="cat.id"
        >
            <img :src="cat.image" alt="" class="img-cat">
        </li>
    </ul>
</div>
<p v-else>Cargando perfil...</p>

<button>Editar perfil</button>

<div v-if="posts">
    <p v-if="posts.length === 0">No has publicado fotos todavía :(</p>

    <ul>
        <li
            v-for="post in posts"
            :key="post.id"
        >
            <img :src="post.image" alt="" class="post__image">
        </li>
    </ul>
</div>
<p v-else>Cargando posts...</p>
</template>

<script>
import api from '../helpers/api.js';

export default {
    name: 'Profile',
    data() {
        return {
            user: null,
            cats: null,
            posts: null,
        };
    },
    methods: {
        async getUserData() {
            try {
                // Datos del perfil del usuario
                const responseProfile = await api.get('users/profile');
                this.user = responseProfile.data.data;

                // Gatos del usuario
                const responseCats = await api.get(`v1/cats/user/${this.user.id}`);
                this.cats = responseCats.data.data;

                // Seguidores del usuario

                // Seguidor por el usuario

                // Posts del usuario
                const responsePosts = await api.get(`v1/posts/user/${this.user.id}`);
                this.posts = responsePosts.data.data;
            } catch (error) {
                console.error('Error al obtener el perfil del usuario:', error);
            }
        },

        // async getUserCats() {
        //     try {
        //
        //     } catch (error) {
        //         console.error('Error al obtener los gatos:', error);
        //     }
        // }
    },
    computed: {
        userId() {
            return this.user ? this.user.id : '';
        },

        userName() {
            return this.user ? this.user.name : '';
        },

        userUsername() {
            return this.user ? this.user.username : '';
        },

        userDescription() {
            return this.user ? this.user.description : '';
        },

        userImProfile() {
            return this.user ? this.user.img_profile : '';
        }
    },
    created() {
        this.getUserData();
    }
};
</script>

<style scoped>
.img-profile {
    width: 100px;
}

.img-cat {
    height: 50px;
}

.post__image {
    height: 200px;
}
</style>
