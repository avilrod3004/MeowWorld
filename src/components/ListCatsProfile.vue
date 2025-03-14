<template>
    <ul v-if="cats" class="perfil__gatos">
        <li
            v-for="cat in cats"
            :key="cat.id"
            class="gatos__gato"
        >
            <img :src="cat.image" alt="" class="gato__imagen" @click="gotToCatProfile(cat.id)">
        </li>
    </ul>
</template>

<script>
export default {
    name: "ListCatsProfile",

    props: {
        cats: {
            type: Array,
            required: true,
        }
    },

    methods: {
        /**
         * Redirige a la página del perfil del gato al hacer clic en su imagen.
         * Utiliza el ID del gato para hacer la navegación.
         */
        gotToCatProfile(catId) {
            this.$router.push({ name: "CatId", params: { id: catId } });
        },
    }
}
</script>

<style scoped>
.perfil__gatos {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.gatos__gato {
    cursor: pointer;
}

.gato__imagen {
    height: 3rem;
    width: 3rem;
    border-radius: 50%;
    object-fit: cover;
}
</style>