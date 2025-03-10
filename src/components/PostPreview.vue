<template>
<article class="post">
    <div class="post__user">
        <img :src="this.post.author.img_profile" alt="devolver imagen desde la api!!" class="user__image">

        <div class="user__data">
            <div class="data__names">
                <p class="names__name">{{ this.post.author.name }}</p>
                <p class="names__username">@{{ this.post.author.username }}</p>
            </div>
            <p class="data__date">{{ formatData(this.post.created_at) }}</p>
        </div>
    </div>

    <img :src="this.post.image" alt="" class="post__image">

    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid commodi cupiditate dolore enim eum, facilis, hic illo incidunt ipsam labore maxime provident quibusdam quis quisquam reiciendis sed tempore vitae.</p>

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
        <li class="acciones__opcion link">Ver post</li>
    </ul>
</article>
</template>

<script>
import formatData from "../helpers/formatData.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons"

library.add(faHeart, fasHeart, faComment);

export default {
    name: "PostPreview",
    components: { FontAwesomeIcon },

    data() {
        return {
            liked: null,
        }
    },

    props: {
        post: {
            type: Object,
            required: true
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

.post__user {
    display: flex;
    gap: 0.5rem;
}

.user__image {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    object-fit: cover;
}

.user__data {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.data__names {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.names__name {
    font-family: "DynaPuff", system-ui;
    font-size: 1.25rem;
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