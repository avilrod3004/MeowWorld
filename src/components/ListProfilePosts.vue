<template>
    <section v-if="posts" class="perfil__posts">
        <h1 class="titulo">Posts</h1>

        <p v-if="posts.length === 0" class="sin_resultado">No hay post publicados</p>

        <ul class="posts__listado" :class="{ 'single-post': posts.length === 1 }">
            <li
                v-for="post in posts"
                :key="post.id"
                class="listado__post"
                @click="openPost(post.id)"
            >
                <img :src="post.image" alt="" class="post__image">
            </li>
            <!-- Columna fantasma si solo hay un post -->
            <li v-if="posts.length === 1" class="listado__post empty-post"></li>
        </ul>
    </section>
</template>

<script>
/**
 * Lista los post publicados por un usuario
 */
export default {
    name: "ListProfilePosts",

    props: {
        posts: {
            type: Array,
            required: true
        },
    },

    methods: {
        /**
         * Abre un post al hacer clic en él.
         * Redirige al usuario a la página del post seleccionado utilizando el ID del post.
         */
        openPost(id) {
            this.$router.push({ name: 'InfoPost', params: { id: id } })
        }
    }
}
</script>

<style scoped lang="scss">
.titulo {
    font-family: "DynaPuff", system-ui;
    font-size: 2rem;
}

.perfil__posts {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
    aspect-ratio: 1 / 1;
    object-fit: cover;
}

/* Columna fantasma para mantener dos columnas */
.empty-post {
    visibility: hidden;
}
</style>
