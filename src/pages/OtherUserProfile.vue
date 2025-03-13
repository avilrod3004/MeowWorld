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

        <ul class="perfil__estadistica" v-if="numFollowing !== null && numFollowers !== null">
            <li class="estadistica__dato" v-if="this.numFollowers >= 1">{{ this.numFollowers }} seguidores</li>
            <li v-else>0 seguidores</li>

            <li class="estadistica__dato" v-if="this.numFollowing >= 1">{{ this.numFollowing }} seguidos</li>
            <li v-else>0 seguidos</li>
            <li v-if="cats" class="estadistica__dato">{{ cats.length }} gatos</li>
        </ul>

        <ListCatsProfile :cats="cats" />

        <button v-if="this.isFollowing !== null && !this.isFollowing" class="button__primary" @click="followUser">Seguir</button>
        <button v-if="this.isFollowing !== null && this.isFollowing" class="button__secondary" @click="unFollowUser">Dejar de seguir</button>
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
import {useUserStore} from "../stores/userStore.js";


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
            authUserId: null,
            isFollowing: null,
            numFollowers: null,
            numFollowing: null,
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

                // Saber si le sique el usuario autenticado
                const responseIsFollowing = await api.get(`follows/isfollowing/${this.userId}`);
                this.isFollowing = responseIsFollowing.data.isFollowing;

                // Seguidores del usuario
                const responseFollowers = await api.get(`follows/followers/${this.userId}`);
                this.numFollowers = responseFollowers.data.data.length;

                // Seguidos por el usuario
                const responseFollowing = await api.get(`follows/following/${this.userId}`);
                this.numFollowing = responseFollowing.data.data.length;

                // Posts del usuario
                const responsePosts = await api.get(`posts/user/${this.userId}`);
                this.posts = responsePosts.data.data;
            } catch (error) {
                console.error('Error al obtener el perfil del usuario:', error);
            }
        },

        async followUser() {
            try {
                const responseFollow = await api.post(`follows`, { "followed_id": this.userId });

                    if (responseFollow.status === 200) {
                        this.isFollowing = true;
                    }
            } catch (error) {
                console.log(error)
            }
        },

        async unFollowUser() {
            try {
                const responseFollow = await api.delete(`follows/unfollow/${this.userId}`);

                if (responseFollow.status === 200) {
                    this.isFollowing = false;
                }
            } catch (error) {
                console.log(error)
            }
        }
    },

    created() {
        this.authUserId = useUserStore().getUser.id
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
