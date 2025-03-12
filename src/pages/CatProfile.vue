<template>
<section v-if="cat" class="perfil">
    <ProfileData
        :id="this.id"
        type="cat"
        :description="this.cat.description"
        :username="this.cat.owner.username"
        :name="this.cat.name"
        :img-profile="this.cat.image"
    />

    <span v-if="this.cat.en_adopcion" class="perfil__adopt"><font-awesome-icon icon="paw" class="icono icono-adopt"/> En adopción</span>

    <button class="button__secondary editar-perfil" @click="updateCatProfile">Editar perfil</button>
</section>
<p v-else>Cargando perfil...</p>

<ListProfilePosts no-post-message="no hay fotos de este gato" :posts="[]"/>
</template>

<script>
import api from "../helpers/api.js";
import ProfileData from "../components/ProfileData.vue";
import ListProfilePosts from "../components/ListProfilePosts.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPaw } from "@fortawesome/free-solid-svg-icons";

library.add(faPaw);

export default {
    name: "CatProfile",
    components: { ListProfilePosts, ProfileData, FontAwesomeIcon },

    props: {
        id: {
            type: Number,
            required: true
        }
    },

    data() {
        return {
            cat: null,
        }
    },

    methods: {
        async getCatData() {
            try {
                const responseCatProfile = await api.get(`cats/${this.id}`);
                this.cat = responseCatProfile.data.data
            } catch (error) {
                console.log(error);
            }
        },

        updateCatProfile() {
            this.$router.push({ name: 'EditCatProfile', params: { id: this.cat.id } });
        }
    },

    created() {
        this.getCatData();
    }
}

</script>

<style scoped lang="scss">
.perfil {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.perfil__adopt {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;

    background-color: var(--adopt-bg-color);
    color: var(--adopt-text-color);
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;

    width: fit-content;
}

.editar-perfil {
    width: 100%;
}
</style>