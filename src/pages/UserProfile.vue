<template>
    <Spinner v-if="loading"/>
    <div v-else>
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
            <button class="button__secondary" @click="goToCreateCat">Registrar gato</button>
        </section>

        <ListProfilePosts :posts="posts" />
    </div>
    <ErrorsList v-if="errorsServer" :errorsServer="this.errorsServer" />
</template>

<script>
import api from '../helpers/api.js';
import ProfileData from "../components/ProfileData.vue";
import ListProfilePosts from "../components/ListProfilePosts.vue";
import ListCatsProfile from "../components/ListCatsProfile.vue";
import Spinner from "../components/Spinner.vue";
import ErrorsList from "../components/ErrorsList.vue";

export default {
    name: 'Profile',
    components: {ErrorsList, Spinner, ListCatsProfile, ListProfilePosts, ProfileData},

    data() {
        return {
            loading: true,
            user: null,
            cats: null,
            posts: null,
            numFollowers: null,
            numFollowing: null,
            errorsServer: null,
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
                this.errorsServer = error.response?.data.errors || ["Ha ocurrido un error inesperado al cargar los datos del perfil. Vuelva a interntarlo más tarde."];
                this.loading = false;
            }
        },

        editUserProfile() {
            this.$router.push(`/profile/edit`);
        },

        goToCreateCat() {
            this.$router.push(`/cat/new`);
        },
    },

    async created() {
        await this.getUserData();
        this.loading = false;
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
