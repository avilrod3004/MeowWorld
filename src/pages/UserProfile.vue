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

        <ul class="perfil__estadistica" v-if="numFollowing !== null && numFollowers !== null">
            <li class="estadistica__dato" v-if="this.numFollowers >= 1">{{ this.numFollowers }} seguidores</li>
            <li v-else>0 seguidores</li>

            <li class="estadistica__dato" v-if="this.numFollowing >= 1">{{ this.numFollowing }} seguidos</li>
            <li v-else>0 seguidos</li>
            <li v-if="cats" class="estadistica__dato">{{ cats.length }} gatos</li>
        </ul>

        <ListCatsProfile :cats="cats" />

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
import ListCatsProfile from "../components/ListCatsProfile.vue";

export default {
    name: 'Profile',
    components: {ListCatsProfile, ListProfilePosts, ProfileData},

    data() {
        return {
            user: null,
            cats: null,
            posts: null,
            numFollowers: null,
            numFollowing: null,
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
                const responseFollowers = await api.get(`follows/followers/${this.user.id}`);
                this.numFollowers = responseFollowers.data.data.length;

                // Seguidos por el usuario
                const responseFollowing = await api.get(`follows/following/${this.user.id}`);
                this.numFollowing = responseFollowing.data.data.length;

                // Posts del usuario
                const responsePosts = await api.get(`posts/user/${this.user.id}`);
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
