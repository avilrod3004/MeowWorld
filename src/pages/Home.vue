<template>
    <div v-if="posts && posts.length > 0">
        <Post v-for="post in posts" :key="post.id" :post="post" :all-info="false"/>
    </div>

    <p v-if="!posts">Cargando....</p>
    <p v-if="posts && posts.length === 0" class="sin_resultado">No hay posts por aquí... 🐾 ¿Están todos los gatitos dormidos?</p>

    <ul v-if="errorsServer">
        <li v-for="error in errorsServer" class="form__error">{{ error }}</li>
    </ul>
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
            errorsServer: null,
        }
    },

    methods: {
        async getLastPosts() {
            try {
                const responsePosts = await api.get('posts')
                this.posts = responsePosts.data.data;
            } catch (error) {
                this.errorsServer = error.response?.data.errors || ["[ERROR]: Ha ocurrido un error inesperado. Vuelva a interntarlo más tarde."];
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