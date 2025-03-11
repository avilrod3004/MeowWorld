<template>
    <div v-if="isOpen" class="modal" @click.self="closeModal">
        <div class="modal__contenido">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "Modal",
    props: {
        isOpen: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        }
    }
};
</script>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;

    width: 100vw;
    height: 100vh;

    background: rgba(0, 0, 0, 0.5);

    display: flex;
    justify-content: center;
    align-items: center;
}

.modal__contenido {
    background: var(--background-color);
    padding: 3rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    width: 22rem;
}
</style>