<template>
    <Spinner v-if="loading"/>
    <section v-else class="perfil">
    <ProfileData
        :id="this.cat.id"
        type="cat"
        :description="this.cat.description"
        :username="this.cat.owner.username"
        :name="this.cat.name"
        :img-profile="this.cat?.image || defaultImage"
    />

    <span v-if="this.cat.en_adopcion" class="perfil__adopt"><font-awesome-icon icon="paw" class="icono icono-adopt"/> En adopción</span>

    <div v-if="this.catOwner && this.authUserId && (this.catOwner === this.authUserId)" class="buttons">
        <button class="button__secondary editar-perfil" @click="updateCatProfile">Editar perfil</button>
        <button class="button__secondary editar-perfil" @click="showModalDeleteCat = true">Eliminar gato</button>

        <ErrorsList :errors-server="errorsServer"/>
    </div>

    <Modal :is-open="showModalDeleteCat">
        <p class="pregunta">¿Quiere eliminar el perfil de este gato?</p>
        <p>Las fotos en las que aparece no serán eliminadas</p>
        <div class="modal__buttons">
            <button class="button__cancel" @click="showModalDeleteCat = false">Cancelar</button>
            <button class="button__confirm" @click="deleteCatProfile">Eliminar</button>
        </div>
    </Modal>
</section>

<ListProfilePosts v-if="posts" :posts="posts"/>
</template>

<script>
import api from "../helpers/api.js";
import ProfileData from "../components/ProfileData.vue";
import ListProfilePosts from "../components/ListProfilePosts.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import Modal from "../modals/Modal.vue";
import {useUserStore} from "../stores/userStore.js";
import defaultImg from '../assets/default_cat_img_profile.png';
import Spinner from "../components/Spinner.vue";
import ErrorsList from "../components/ErrorsList.vue";


library.add(faPaw);

export default {
    name: "CatProfile",
    components: {ErrorsList, Spinner, ListProfilePosts, ProfileData, FontAwesomeIcon, Modal },

    data() {
        return {
            catId: null,
            cat: null,
            posts: null,
            showModalDeleteCat: false,
            catOwner: null,
            authUserId: null,
            defaultImage: defaultImg,
            loading: true,
            errorsServer: null,
        }
    },

    methods: {
        async getCatData() {
            try {
                this.errorsServer = null;
                const responseCatProfile = await api.get(`cats/${this.catId}`);
                this.cat = responseCatProfile.data.data
                this.catOwner = responseCatProfile.data.data.owner.id;

                const responseCatPosts = await api.get(`catpost/cat/${this.catId}`)
                this.posts = responseCatPosts.data.data
            } catch (error) {
                this.errorsServer = error.response?.data.errors || ["Ha ocurrido un error al cargar los datos del perfil. Vuelva a interntarlo más tarde."];
                this.loading = false;
            }
        },

        updateCatProfile() {
            this.$router.push({ name: 'EditCatProfile', params: { id: this.catId } });
        },

        async deleteCatProfile() {
            try {
                this.loading = true;
                this.errorsServer = null;
                const responseDeleteCatProfile = await api.delete(`cats/${this.catId}`);

                if (responseDeleteCatProfile.status === 200) {
                    this.$router.push('/profile');
                }
            } catch (error) {
                this.errorsServer = error.response?.data.errors || ["Ha ocurrido un error al intentar eliminar el gato."];
                this.loading = false;
            }
        }
    },

    async created() {
        this.catId = this.$route.params.id;
        this.authUserId = useUserStore().getUser.id
        await this.getCatData();

        this.loading = false;
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

.buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>