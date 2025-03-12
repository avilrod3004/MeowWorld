<template>
<div v-if="user && posts && cats">
    <section class="perfil">
        <ProfileData
            :id="this.user.id"
            type="user"
            :description="this.user.description"
            :username="this.user.username"
            :name="this.user.name"
            :img-profile="this.user.img_profile"
        />

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
                <img :src="cat.image" alt="" class="gato__imagen" @click="gotToCatProfile(cat.id)">
            </li>
            <li>[+]</li>
        </ul>

        <button class="button__secondary editar-perfil" @click="editUserProfile">Editar perfil</button>
    </section>

    <ListProfilePosts
        no-post-message="No has publicado fotos todavía :("
        :posts="posts"
    />
</div>
<p v-else>Cargando perfil...</p>
</template>

<script>
import api from '../helpers/api.js';
import ProfileData from "../components/ProfileData.vue";
import ListProfilePosts from "../components/ListProfilePosts.vue";

export default {
    name: 'Profile',
    components: {ListProfilePosts, ProfileData},

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

                // Seguidos por el usuario

                // Posts del usuario
                const responsePosts = await api.get(`posts/user/${this.user.id}`);
                this.posts = responsePosts.data.data;
            } catch (error) {
                console.error('Error al obtener el perfil del usuario:', error);
            }
        },

        gotToCatProfile(catId) {
            this.$router.push(`/cat/${catId}`);
        },

        goToCreateCat() {

        },

        editUserProfile() {
            this.$router.push(`/profile/edit`);
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

.perfil__estadistica {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
}

.perfil__gatos {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
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
</style>
