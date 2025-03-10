<template>
<div v-if="post && comments">
    <Post :post="this.post" :all-info="true"/>
    <section>
        <h1>Comentarios</h1>

        <Comment v-for="comment in this.comments" :comment="comment"/>
    </section>
</div>
<p v-else>Cargando...</p>

</template>

<script>
import Post from "../components/Post.vue";
import Comment from "../components/Comment.vue";
import api from "../helpers/api.js";

export default {
    name: "InfoPost",
    components: {Post, Comment},

    data() {
        return {
            postId: null,
            post: null,
            comments: null,
        }
    },

    methods: {
        async getPostData() {
            try {
                const responsePost = await api.get(`/posts/${this.$route.params.id}`);
                this.post = responsePost.data.data;

                const responseComments = await api.get(`/comments/post/${this.postId}`);
                this.comments = responseComments.data.data;
                console.log(this.comments);
            } catch (error) {
                console.log(error);
            }
        }
    },

    created() {
        this.postId = this.$route.params.id;
        // Aquí podrías hacer una llamada a la API para obtener el post
        this.getPostData();
    }
}
</script>

<style scoped>

</style>