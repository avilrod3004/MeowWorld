<template>
    <ul v-if="cats" class="perfil__gatos">
        <li v-if="cats.length === 0">No tienes ningún gatito registrado :(</li>

        <li
            v-for="cat in cats"
            :key="cat.id"
            class="gatos__gato"
        >
            <img :src="cat.image" alt="" class="gato__imagen" @click="gotToCatProfile(cat.id)">
        </li>
        <li @click="goToCreateCat">[+]</li>
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
        gotToCatProfile(catId) {
            this.$router.push(`/cat/${catId}`);
        },

        goToCreateCat() {
            this.$router.push(`/cat/new`);
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