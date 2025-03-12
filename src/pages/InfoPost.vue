<template>
<div v-if="post && comments">
    <Post :post="this.post" :all-info="true"/>
    <section>
        <h1>Comentarios</h1>

        <Form
            @submit="submitComment"
            :validation-schema="schema"
            v-slot="{ resetForm }"
        >
            <Field name="commentText" v-slot="{ field }">
                <textarea
                    id="commentText"
                    class="form__input form__textarea"
                    v-bind="field"
                    placeholder="Añade un comentario..."
                ></textarea>
            </Field>
            <ErrorMessage name="commentText" class="error" />

            <button type="submit" class="button__primary">Publicar</button>

<!--            <ul>-->
<!--                <li v-for="error in this.errorsServer" class="form__error">{{ error }}</li>-->
<!--            </ul>-->
        </Form>

        <Comment v-for="comment in this.comments" :comment="comment"/>
    </section>
</div>
<p v-else>Cargando...</p>

</template>

<script>
import Post from "../components/Post.vue";
import Comment from "../components/Comment.vue";
import api from "../helpers/api.js";
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
    name: "InfoPost",
    components: {ErrorMessage, Field, Post, Comment, Form},

    data() {
        return {
            postId: null,
            post: null,
            comments: null,
            schema: yup.object().shape({
                commentText: yup
                    .string()
                    .trim()
                    .required("Añade un comentario")
                    .max(255, "La longitud máxima del comentario es de 255 caracteres.")
            })
        }
    },

    methods: {
        async getPostData() {
            try {
                const responsePost = await api.get(`/posts/${this.$route.params.id}`);
                this.post = responsePost.data.data;

                const responseComments = await api.get(`/comments/post/${this.postId}`);
                this.comments = responseComments.data.data;
            } catch (error) {
                console.log(error);
            }
        },

        async submitComment(values, { resetForm }) {
            try {
                const responseComment = await api.post(`/comments`,
                    {
                        "post_id": this.postId,
                        "text": values.commentText,
                    }
                );

                if (responseComment.status === 201) {
                    await this.getPostData();
                    resetForm();
                }
            } catch (error) {
                console.log(error);
            }
        },
    },

    created() {
        this.postId = this.$route.params.id;

        this.getPostData();
    }
}
</script>

<style scoped>

</style>