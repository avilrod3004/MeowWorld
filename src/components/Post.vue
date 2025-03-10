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
            <span>0</span>
        </li>
        <li class="acciones__opcion">
            <font-awesome-icon :icon="['far', 'comment']" class="icono icono-header"/>
            <span>0</span>
        </li>
        <li
            v-if="!allInfo"
            class="acciones__opcion link"
        >
            <router-link :to="{ name: 'InfoPost', params: { id: this.post.id } }">
                Ver post
            </router-link>
        </li>
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

library.add(faHeart, fasHeart, faComment);

export default {
    name: "PostPreview",
    components: {PostPreviewHeader: PostHeader, FontAwesomeIcon },

    data() {
        return {
            liked: null,
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

        saveLike() {
            this.liked = !this.liked;

            if (this.liked) {
                console.log("Like guardado");
                // Aquí harías la petición para guardar el like
            } else {
                console.log("Like eliminado");
                // Aquí harías la petición para quitar el like
            }
        }
    },
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