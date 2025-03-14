<template>
    <div v-if="isOpen" class="modal" @click.self="closeModal">
        <div class="modal__contenido">
            <slot></slot>
        </div>
    </div>
</template>

<script>
/**
 * Componente modal reutilizable que se muestra cuando la propiedad `isOpen` es verdadera.
 * El modal se cierra cuando el usuario hace clic fuera de la caja de contenido, emitiendo un evento `close`.
 */
export default {
    name: "Modal",
    props: {
        isOpen: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        /**
         * Cierra el modal emitiendo el evento `close` al componente padre.
         */
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
    z-index: 20;
}
</style>