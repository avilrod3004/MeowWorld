<template>
<section v-if="user" class="perfil">
    <div class="perfil__datos">
        <img :src="userImProfile" alt="" class="datos__imagen">
        <div class="datos__listado">
            <p class="listado__nombre">{{ userName }}</p>
            <p class="listado__username">@{{ userUsername}}</p>
        </div>
        <p class="datos__descripcion">{{ userDescription }}</p>
    </div>

    <ul class="perfil__estadistica">
        <li class="estadistica__dato">seguidores</li>
        <li class="estadistica__dato">seguidos</li>
        <li v-if="cats" class="estadistica__dato">{{ cats.length }} gatos</li>
    </ul>

    <ul v-if="cats" class="perfil__gatos">
        <li v-if="cats.length === 0">No tienes ningún gatito registrado :(</li>

        <li
            v-for="cat in cats"
            :key="cat.id"
            class="gatos__gato"
        >
            <img :src="cat.image" alt="" class="gato__imagen">
        </li>
    </ul>

    <button class="button__secondary editar-perfil">Editar perfil</button>
</section>
<p v-else>Cargando perfil...</p>

<section v-if="posts" class="perfil__posts">
    <p v-if="posts.length === 0">No has publicado fotos todavía :(</p>

    <ul class="posts__listado">
        <li
            v-for="post in posts"
            :key="post.id"
            class="listado__post"
        >
            <img :src="post.image" alt="" class="post__image">
        </li>
    </ul>
</section>
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
                const responseProfile = await api.get('auth/me');
                this.user = responseProfile.data.data;

                // Gatos del usuario
                const responseCats = await api.get(`cats/user/${this.user.id}`);
                this.cats = responseCats.data.data;

                // Seguidores del usuario

                // Seguidor por el usuario

                // Posts del usuario
                const responsePosts = await api.get(`posts/user/${this.user.id}`);
                this.posts = responsePosts.data.data;
            } catch (error) {
                console.error('Error al obtener el perfil del usuario:', error);
            }
        },
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
.perfil {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.perfil__datos {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.datos__imagen {
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 50%;
    object-fit: cover;
}

.datos__listado {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.listado__nombre {
    font-family: "DynaPuff", system-ui;
    font-weight: normal;
    font-style: normal;
    font-size: 2rem;
}

.datos__descripcion {
    width: 100%;
}

.perfil__estadistica {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
}

.perfil__gatos {
    display: flex;
    gap: 1rem;
}

.gato__imagen {
    height: 3rem;
    width: 3rem;
    border-radius: 50%;
    object-fit: cover;
}

.editar-perfil {
    width: 100%;
}

.perfil__posts {
    margin-top: 1rem;
}

.posts__listado {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 1rem;
    max-width: 100%;
}

.post__image {
    width: 100%;
    aspect-ratio: 1 / 1; /* Hace que la imagen siempre sea cuadrada */
    object-fit: cover; /* Ajusta la imagen para que se recorte y se vea bien */
}
</style>
