<template>
<article class="post">
    <PostPreviewHeader
        :id="this.post.author.id"
        :created_at="this.post.created_at"
        :username="this.post.author.username"
        :name="this.post.author.name"
        :img_profile="this.post.author.img_profile"
    />

    <img :src="this.post.image" alt="" class="post__image">

    <p>{{ this.post.description }}</p>

    <div v-if="allInfo">
        <p>Gatos:</p>
        <ul>
            <li>Misufú</li>
        </ul>
    </div>

    <ul class="post__acciones">
        <li class="acciones__opcion">
            <font-awesome-icon
                v-if="!liked"
                :icon="['far', 'heart']"
                class="icono"
                @click="saveLike"
            />
            <font-awesome-icon
                v-if="liked"
                :icon="['fas', 'heart']"
                class="icono icono-liked"
                @click="saveLike"
            />
            <span v-if="numLikes >= 1">{{ this.numLikes }}</span>
            <span v-else>0</span>
        </li>

        <li v-if="!allInfo" class="acciones__opcion">
            <font-awesome-icon :icon="['far', 'comment']" class="icono icono-header"/>
            <span v-if="numComments >= 1">{{ this.numComments }}</span>
            <span v-else>0</span>
        </li>

        <li
            v-if="!allInfo"
            class="acciones__opcion link"
        >
            <router-link :to="{ name: 'InfoPost', params: { id: this.post.id } }">
                Ver post
            </router-link>
        </li>

        <li v-if="allInfo" @click="openModalEditPost">Editar</li>
        <Modal :is-open="showModalEditPost" v-slot="{ values }">
            <Form :validation-schema="schema">
                <label for="description">Cambiar la descripción del post:</label>
                <Field
                    name="description"
                    class="form__input"
                    as="textarea"
                    v-model="currentDescription"
                />
                <ErrorMessage name="description" class="form__error"/>
            </Form>

            <button @click="showModalEditPost = false">Cancelar</button>
            <button @click="editPost">Actualizar post</button>
        </Modal>

        <li v-if="allInfo" @click="showModalDeletePost = true">Borrar</li>
        <Modal :is-open="showModalDeletePost">
            <p>¿Quiere eliminar este post?</p>
            <button @click="showModalDeletePost = false">Cancelar</button>
            <button @click="deletePost">Borrar post</button>
        </Modal>
    </ul>
</article>
</template>

<script>
import formatData from "../helpers/formatData.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons"
import PostHeader from "./PostHeader.vue";
import api from "../helpers/api.js";
import Modal from "../modals/Modal.vue";
import * as yup from 'yup';
import {Form, Field, ErrorMessage} from "vee-validate";

library.add(faHeart, fasHeart, faComment);

export default {
    name: "PostPreview",
    components: {
        PostPreviewHeader: PostHeader,
        FontAwesomeIcon,
        Modal,
        Form,
        Field,
        ErrorMessage
    },

    data() {
        return {
            liked: null,
            numLikes: null,
            numComments: null,
            showModalEditPost: false,
            currentDescription: "",
            showModalDeletePost: false,
            schema: yup.object().shape({
                description: yup
                    .string()
                    .trim()
                    .required("Añade una descripción de la imagen del post.")
                    .max(2000, "La descripción debe tener una longitud máxima de 2000 caracteres"),
            })
        }
    },

    props: {
        post: {
            type: Object,
            required: true
        },
        allInfo: {
            type: Boolean,
            required: true,
        }
    },

    methods: {
        formatData,

        async isLiked() {
            try {
                const reponseLike = await api.get(`likes/isLiked/${this.post.id}`);

                if (reponseLike.status === 200) {
                    this.liked = reponseLike.data.isLiked;
                }
            }
            catch(error) {
                console.log(error);
            }
        },

        async getNumLikes() {
            try {
                const reponseNumLike = await api.get(`likes/post/${this.post.id}`);
                this.numLikes = reponseNumLike.data.likes;
            } catch (error) {
                console.log(error);
            }
        },

        async saveLike() {
            this.liked = !this.liked;

            if (this.liked) {
                try {
                    const responseLike = await api.post(`likes`, {"post_id": this.post.id});
                    await this.getNumLikes();
                } catch (error) {
                    console.log(error);
                }
            } else {
                try {
                    const responseLike = await api.delete(`likes/${this.post.id}`);
                    await this.getNumLikes();
                } catch (error) {
                    console.log(error);
                }
            }
        },

        async getNumComments() {
            try {
                const responseComments = await api.get(`/comments/post/${this.post.id}`);
                this.numComments = responseComments.data.meta.total;
            } catch (error) {
                console.log(error);
            }
        },

        async deletePost() {
            try {
                const reponseDeletePost = await api.delete(`/posts/${this.post.id}`);

                if (reponseDeletePost.status === 200) {
                    this.$router.push('/profile')
                }
            } catch (error) {
                console.log(error);
            }
        },

        openModalEditPost() {
            this.currentDescription = this.post.description;
            this.showModalEditPost = true
        },

        async editPost(values) {
            try {
                const responseEditPost = await api.put(`/posts/${this.post.id}`, values);

                if (responseEditPost.status === 200) {
                    this.showModalEditPost = false
                }
            } catch (error) {
                console.log(error);
            }
        }
    },

    created() {
        this.isLiked();
        this.getNumLikes();
        this.getNumComments();
    }
}
</script>

<style scoped>
.post {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    border-bottom: 0.1rem solid #ccc;
    padding: 1rem 0
}

.post__image {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
}

.post__acciones {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.acciones__opcion {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

</style>