<template>
    <div class="comment">
        <div class="comment__aside">
            <img :src="this.comment.user?.img_profile || this.defaultImage" alt="" class="img__profile">
            <p class="link" v-if="this.authorId === this.authUserId" @click="showModalDeleteComment = true">Borrar</p>
            <Modal :is-open="showModalDeleteComment">
                <p>¿Quiere eliminar este comentario?</p>
                <button @click="showModalDeleteComment = false">Cancelar</button>
                <button @click="deleteComment">Borrar comentario</button>
            </Modal>
        </div>

        <div class="comment__texto">
            <div class="texto__nombres">
                <p class="nombres__nombre">{{ this.comment.user.name }}</p>
                <p>@{{ this.comment.user.username }}</p>
            </div>
            <div class="comment__message">
                <p>{{ this.comment.text }}</p>
                <p>{{ formatData(this.comment.created_at) }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import formatData from "../helpers/formatData.js";
import api from "../helpers/api.js";
import Modal from "../modals/Modal.vue";
import defaultImg from '../assets/default_img_profile.png';
import {useUserStore} from "../stores/userStore.js";


export default {
    name: "Comment",
    components: {Modal},

    props: {
        comment: {
            type: Object,
            required: true,
        }
    },

    data() {
        return {
            showModalDeleteComment: false,
            defaultImage: defaultImg,
            authUserId: null,
            authorId: null,
        }
    },

    methods: {
        formatData,

        async deleteComment() {
            try {
                const responseDeleteComment = await api.delete(`/comments/${this.comment.id}`);
                console.log(this.comment.post.id);

                if (responseDeleteComment.status === 200) {
                    this.$router.back() // :(
                }

            } catch (error) {
                console.error(error);
            }
        }
    },

    created() {
        this.authorId = this.comment.user.id;
        this.authUserId = useUserStore().getUser.id
    }
}
</script>

<style scoped>
.comment {
    display: flex;
    gap: 0.5rem;

    padding: 1rem 0;
    border-bottom: 0.1rem solid #ccc;
}

.comment__aside {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.img__profile {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    object-fit: cover;
}

.comment__texto {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.texto__nombres {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.nombres__nombre {
    font-family: "DynaPuff", system-ui;
    font-size: 1.25rem;
}

.comment__message {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
</style>