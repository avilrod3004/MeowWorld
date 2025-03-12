<template>
    <div v-if="posts && posts.length > 0">
        <Post v-for="post in posts" :key="post.id" :post="post" :all-info="false"/>
    </div>

    <p v-if="!posts">Cargando....</p>
    <p v-if="posts && posts.length === 0">No hay post publicados</p>
</template>

<script>
import Post from "../components/Post.vue";
import api from "../helpers/api.js";

export default {
    name: "Home",
    components: {Post},

    data() {
        return {
            posts: null,
        }
    },

    methods: {
        async getLastPosts() {
            try {
                const responsePosts = await api.get('posts')
                this.posts = responsePosts.data.data;
            } catch (error) {
                console.log(error);
            }
        }
    },

    created() {
        this.getLastPosts();
    }
}
</script>

<style scoped>

</style>