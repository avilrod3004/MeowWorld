<template>
<section v-if="posts" class="perfil__posts">
    <p v-if="posts.length === 0">No has publicado fotos todavía :(</p>

    <ul class="posts__listado">
        <li
            v-for="post in posts"
            :key="post.id"
            class="listado__post"
            @click="openPost(post.id)"
        >
            <img :src="post.image" alt="" class="post__image">
        </li>
    </ul>
</section>
<p v-else>Cargando posts...</p>
</template>

<script>
export default {
    name: "ListProfilePosts",

    props: {
        posts: {
            type: Array,
            required: true
        },
        noPostMessage: {
            type: String,
            required: true
        }
    },

    methods: {
        openPost(id) {
            this.$router.push({ name: 'InfoPost', params: { id: id } })
        }
    }
}
</script>

<style scoped lang="scss">
.perfil__posts {
    margin-top: 1rem;
}

.posts__listado {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 1rem;
    max-width: 100%;
}

.listado__post {
    cursor: pointer;
}

.post__image {
    width: 100%;
    aspect-ratio: 1 / 1; /* Hace que la imagen siempre sea cuadrada */
    object-fit: cover; /* Ajusta la imagen para que se recorte y se vea bien */
}
</style>