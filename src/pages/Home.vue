<template>
    <Spinner v-if="loading"/>
    <div v-else>
        <div v-if="posts && posts.length > 0">
            <Post v-for="post in posts" :key="post.id" :post="post" :all-info="false"/>
        </div>

        <p v-if="!posts || posts.length === 0" class="sin_resultado">No hay posts por aquí... 🐾 ¿Están todos los gatitos dormidos?</p>

        <ErrorsList :errorsServer="errorsServer"/>
    </div>
</template>

<script>
import Post from "../components/Post.vue";
import api from "../helpers/api.js";
import ErrorsList from "../components/ErrorsList.vue";
import Spinner from "../components/Spinner.vue";

/**
 * Componente Home
 *
 * Muestra los últimos posts disponibles en la aplicación.
 * Si no hay publicaciones, muestra un mensaje informativo.
 */
export default {
    name: "Home",
    components: {Spinner, ErrorsList, Post},

    data() {
        return {
            posts: null,
            errorsServer: null,
            loading: true,
        }
    },

    methods: {
        /**
         * Obtiene las publicaciones más recientes de la API.
         */
        async getLastPosts() {
            try {
                const responsePosts = await api.get('posts')
                this.posts = responsePosts.data.data;
            } catch (error) {
                this.errorsServer = error.response?.data.errors || ["Ha ocurrido un error inesperado. Vuelva a interntarlo más tarde."];
            }
        }
    },

    async created() {
        await this.getLastPosts();
        this.loading = false;
    }
}
</script>

<style scoped>

</style>