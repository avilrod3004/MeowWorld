<template>
    <div class="mensaje">
        <h1 class="titulo">Notificaciones</h1>
        <p>Aquí podrás ver todas tus notificaciones en tiempo real. Esta sección estará disponible en una futura actualización. ¡Gracias por tu paciencia!</p>
    </div>
</template>

<script>
export default {
    name: "Notifications"
}
</script>

<style scoped>
.mensaje {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.titulo {
    font-family: "DynaPuff", system-ui;
    font-size: 2rem;
}
</style>