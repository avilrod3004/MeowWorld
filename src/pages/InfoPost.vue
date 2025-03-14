<template>
    <Spinner v-if="loading" />
    <div v-else>
        <div v-if="post && comments">
            <Post :post="this.post" :all-info="true"/>
            <section>
                <h1 class="titulo">Comentarios</h1>

                <Form
                    @submit="submitComment"
                    :validation-schema="schema"
                    v-slot="{ resetForm }"
                    class="formulario"
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

                    <Spinner v-if="loadingComment" />

                    <button type="submit" class="button__primary">Publicar</button>

                    <ErrorsList :errors-server="this.errorsServer" />
                </Form>

                <Comment v-for="comment in this.comments" :comment="comment"/>
            </section>
        </div>
        <ErrorsList v-else :errors-server="this.errorsServer" />
    </div>
</template>

<script>
import Post from "../components/Post.vue";
import Comment from "../components/Comment.vue";
import api from "../helpers/api.js";
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from "vee-validate";
import Spinner from "../components/Spinner.vue";
import ErrorsList from "../components/ErrorsList.vue";

export default {
    name: "InfoPost",
    components: {ErrorsList, Spinner, ErrorMessage, Field, Post, Comment, Form},

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
            }),
            loading: true,
            loadingComment: false,
            errorsServer: null,
        }
    },

    methods: {
        async getPostData() {
            try {
                const responsePost = await api.get(`/posts/${this.$route.params.id}`);
                if (responsePost.status === 200) {
                    this.post = responsePost.data.data;
                }

                const responseComments = await api.get(`/comments/post/${this.postId}`);

                if (responseComments.status === 200) {
                    this.comments = responseComments.data.data;
                }
            } catch (error) {
                this.errorsServer = []
                this.errorsServer = error.response?.data.errors || ["Ha ocurrido un error inesperado al cargar el post. Vuelva a interntarlo más tarde."];
            }
        },

        async submitComment(values, { resetForm }) {
            try {
                this.loadingComment = true;
                const responseComment = await api.post(`/comments`,
                    {
                        "post_id": this.postId,
                        "text": values.commentText,
                    }
                );

                if (responseComment.status === 201) {
                    await this.getPostData();
                    this.loadingComment = false;
                    resetForm();
                }
            } catch (error) {
                this.errorsServer = []
                this.loadingComment = false;

                if (error.response.status === 422) {
                    if ('post_id' in error.response.data.errors) {
                        this.errors = [...this.errors, ...error.response.data.errors.email];
                    }

                    if ('text' in error.response.data.errors) {
                        this.errors = [...this.errors, ...error.response.data.errors.password];
                    }
                } else {
                    this.errorsServer = error.response?.data.errors || ["Ha ocurrido un error inesperado al cargar el post. Vuelva a interntarlo más tarde."];
                }
            }
        },
    },

    async created() {
        this.postId = this.$route.params.id;

        await this.getPostData();
        this.loading = false;
    }
}
</script>

<style scoped>
.titulo {
    font-family: "DynaPuff", system-ui;
    font-size: 2rem;

    padding: 1rem 0;
}

.formulario {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    border-bottom: 0.1rem solid #ccc;
    padding: 1rem 0
}
</style>