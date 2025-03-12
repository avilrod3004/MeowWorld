<template>
    <div>
        <img :src="this.comment.user.img_profile" alt="">

        <div>
            <p>{{ this.comment.user.name }}</p>
            <p>@{{ this.comment.user.username }}</p>
            <p>{{ this.comment.text }}</p>
            <p>{{ formatData(this.comment.created_at) }}</p>
            <button @click="showModalDeleteComment = true">Borrar</button>
            <Modal :is-open="showModalDeleteComment">
                <p>¿Quiere eliminar este comentario?</p>
                <button @click="showModalDeleteComment = false">Cancelar</button>
                <button @click="deleteComment">Borrar comentario</button>
            </Modal>
        </div>

        <hr>
    </div>
</template>

<script>
import formatData from "../helpers/formatData.js";
import api from "../helpers/api.js";
import Modal from "../modals/Modal.vue";

export default {
    name: "Comment",
    components: {Modal},

    props: {
        comment: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            showModalDeleteComment: false,
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
}
</script>

<style scoped>

</style>