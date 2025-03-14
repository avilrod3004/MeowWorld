<template>
<article class="post">
    <PostPreviewHeader
        :id="this.post.author.id"
        :created_at="this.post.created_at"
        :username="this.post.author.username"
        :name="this.post.author.name"
        :img_profile="this.post.author?.img_profile || defaultImage"
    />

    <img :src="this.post.image" alt="" class="post__image">

    <p>{{ this.post.description }}</p>

    <div v-if="allInfo && cats && cats.length > 0" class="cats">
        <p class="cats__titulo">¿Quién aparece en la foto?</p>
        <ul class="cats__list">
            <li v-for="cat in cats">{{ cat.name }}</li>
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

        <li v-if="allInfo && (this.authUserId === this.post.author.id)" @click="openModalEditPost" class="link">Editar</li>
        <Modal :is-open="showModalEditPost" v-slot="{ values }">
            <Form @submit="editPost" :validation-schema="schema" class="modal__formulario">
                <label for="description" class="formulario__label-input">Cambiar la descripción del post:</label>
                <Field
                    name="description"
                    class="form__input"
                    as="textarea"
                    v-model="currentDescription"
                />
                <ErrorMessage name="description" class="form__error"/>

                <div class="modal__buttons">
                    <button class="button__cancel" @click="showModalEditPost = false">Cancelar</button>
                    <button class="button__confirm" type="submit">Actualizar</button>
                </div>
            </Form>
        </Modal>

        <li v-if="allInfo && (this.authUserId === this.post.author.id)" @click="showModalDeletePost = true" class="link">Borrar</li>
        <Modal :is-open="showModalDeletePost">
            <p class="pregunta">¿Quiere eliminar este post?</p>
            <div class="modal__buttons">
                <button class="button__cancel" @click="showModalDeletePost = false">Cancelar</button>
                <button class="button__confirm" @click="deletePost">Borrar post</button>
            </div>
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
import {useUserStore} from "../stores/userStore.js";
import defaultImg from '../assets/default_img_profile.png';

library.add(faHeart, fasHeart, faComment);

/**
 * Componente que muestra una vista previa de un post, incluyendo información del autor,
 * la imagen del post, la descripción, las interacciones (me gusta, comentarios) y las
 * opciones de editar o eliminar el post.
 */
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
            cats: null,
            showModalEditPost: false,
            currentDescription: "",
            showModalDeletePost: false,
            schema: yup.object().shape({
                description: yup
                    .string()
                    .trim()
                    .required("Añade una descripción de la imagen del post.")
                    .max(2000, "La descripción debe tener una longitud máxima de 2000 caracteres"),
            }),
            errorsServer: null,
            authUserId: null,
            defaultImage: defaultImg,
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
        /**
         * Formatea la fecha del post.
         */
        formatData,

        /**
         * Verifica si el post ha sido marcado como "me gusta" por el usuario actual.
         */
        async isLiked() {
            try {
                const reponseLike = await api.get(`likes/isLiked/${this.post.id}`);

                if (reponseLike.status === 200) {
                    this.liked = reponseLike.data.isLiked;
                }
            }
            catch(error) {
                this.errorsServer = null;
                this.errorsServer = error.response?.data.errors || ["Ha ocurrido un error al cargar los datos del post. Vuelva a intentarlo más tarde."];
            }
        },

        /**
         * Obtiene el número de "me gusta" del post.
         */
        async getNumLikes() {
            try {
                const reponseNumLike = await api.get(`likes/post/${this.post.id}`);

                if (reponseNumLike.status === 200) {
                    this.numLikes = reponseNumLike.data.likes;
                }
            } catch (error) {
                this.errorsServer = null;
                this.errorsServer = error.response?.data.errors || ["Ha ocurrido un error al cargar los datos del post. Vuelva a intentarlo más tarde."];
            }
        },

        /**
         * Guarda o elimina un "me gusta" en el post, según el estado actual.
         */
        async saveLike() {
            this.liked = !this.liked;

            if (this.liked) {
                try {
                    const responseLike = await api.post(`likes`, {"post_id": this.post.id});

                    if (responseLike.status === 200) {
                        await this.getNumLikes();
                    }
                } catch (error) {
                    this.errorsServer = null;
                    this.errorsServer = error.response?.data.errors || ["Ha ocurrido un error al actualizar el post. Vuelva a intentarlo más tarde."];
                }
            } else {
                try {
                    const responseLike = await api.delete(`likes/${this.post.id}`);

                    if (responseLike.status === 200) {
                        await this.getNumLikes();
                    }
                } catch (error) {
                    this.errorsServer = null;
                    this.errorsServer = error.response?.data.errors || ["Ha ocurrido un error al actualizar el post. Vuelva a intentarlo más tarde."];
                }
            }
        },

        /**
         * Obtiene el número de comentarios en el post.
         */
        async getNumComments() {
            try {
                const responseComments = await api.get(`/comments/post/${this.post.id}`);

                if (responseComments.status === 200) {
                    this.numComments = responseComments.data.meta.total;
                }
            } catch (error) {
                this.errorsServer = null;
                this.errorsServer = error.response?.data.errors || ["Ha ocurrido un error al cargar los datos del post. Vuelva a intentarlo más tarde."];
            }
        },

        /**
         * Elimina el post actual.
         */
        async deletePost() {
            try {
                const reponseDeletePost = await api.delete(`/posts/${this.post.id}`);

                if (reponseDeletePost.status === 200) {
                    this.$router.push('/profile')
                }
            } catch (error) {
                this.errorsServer = null;
                this.errorsServer = error.response?.data.errors || ["Ha ocurrido un error al borrar del post. Vuelva a intentarlo más tarde."];
            }
        },

        /**
         * Obtiene la lista de gatos asociados al post (si los hay).
         */
        async getCatsPost() {
            try {
                const responseGetCats = await api.get(`catpost/post/${this.post.id}`)

                if (responseGetCats.status === 200) {
                    this.cats = responseGetCats.data.data
                }
            } catch (error) {
                this.errorsServer = null;
                this.errorsServer = error.response?.data.errors || ["Ha ocurrido un error al cargar los datos del post. Vuelva a intentarlo más tarde."];
            }
        },

        /**
         * Abre el modal de edición de la descripción del post.
         */
        openModalEditPost() {
            this.currentDescription = this.post.description;
            this.showModalEditPost = true
        },

        /**
         * Edita el post con los nuevos valores proporcionados.
         */
        async editPost(values) {
            try {
                const responseEditPost = await api.put(`/posts/${this.post.id}`,
                    {
                        description: values.description,
                    }
                );

                if (responseEditPost.status === 200) {
                    this.showModalEditPost = false
                    this.$router.push('/profile')
                }
            } catch (error) {
                this.errorsServer = null;
                this.errorsServer = error.response?.data.errors || ["Ha ocurrido un error al actualizar del post. Vuelva a intentarlo más tarde."];
            }
        }
    },

    created() {
        this.isLiked();
        this.getNumLikes();
        this.getNumComments();
        this.getCatsPost();
        this.authUserId = useUserStore().getUser.id;
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

.cats {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.cats__titulo {
    font-weight: bold;
}

.cats__list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding-left: 0.5rem;
}

</style>