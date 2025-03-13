<template>
<div v-if="user && posts && cats">
    <section class="perfil">
        <ProfileData
            :id="this.user.id"
            type="user"
            :description="this.user.description"
            :username="this.user.username"
            :name="this.user.name"
            :img-profile="this.user?.img_profile || defaultImage"
        />

        <ul class="perfil__estadistica">
            <li class="estadistica__dato">seguidores</li>
            <li class="estadistica__dato">seguidos</li>
            <li v-if="cats" class="estadistica__dato">{{ cats.length }} gatos</li>
        </ul>

        <ListCatsProfile :cats="cats" />

        <button class="button__primary" @click="editUserProfile">Seguir</button>
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
import ListCatsProfile from "../components/ListCatsProfile.vue";
import defaultImg from '../assets/default_img_profile.png';


export default {
    name: 'Profile',
    components: {ListCatsProfile, ListProfilePosts, ProfileData},

    data() {
        return {
            userId: null,
            user: null,
            cats: null,
            posts: null,
            defaultImage: defaultImg,
        };
    },

    methods: {
        async getUserData() {
            try {
                // Datos del perfil del usuario
                const responseProfile = await api.get(`users/${this.userId}`);
                this.user = responseProfile.data.data;

                // Gatos del usuario
                const responseCats = await api.get(`cats/user/${this.userId}`);
                this.cats = responseCats.data.data;

                // Seguidores del usuario

                // Seguidos por el usuario

                // Posts del usuario
                const responsePosts = await api.get(`posts/user/${this.userId}`);
                this.posts = responsePosts.data.data;
            } catch (error) {
                console.error('Error al obtener el perfil del usuario:', error);
            }
        },

        editUserProfile() {
            this.$router.push(`/profile/edit`);
        }
    },

    created() {
        this.userId = this.$route.params.id;
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

.editar-perfil {
    width: 100%;
}
</style>
