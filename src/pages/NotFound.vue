<template>
    <main>
        <div class="mensaje__error">
            <div class="error__mensaje">
                <h1 class="error__codigo">404</h1>
                <p class="mensaje__texto">Página no encontrada.</p>
                <p class="mensaje__texto">Prueba con otra ruta o regresa al inicio.</p>
                <button @click="goBack" class="button__primary">Volver al inicio</button>
            </div>
        </div>
    </main>
</template>

<script>
export default {
    name: "NotFound",

    methods: {
        goBack() {
            this.$router.go(-1);
        }
    }
}
</script>

<style scoped>
main {
    padding: 1rem;
    height: 95vh;

    color: var(--text-color);

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4rem;
}

main::before {
    content: "";
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    background-image: url('../assets/wallpaper-400.png');
    background-repeat: repeat;
    opacity: 0.3;
    z-index: -1;
}

.mensaje__error {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
}

.error__codigo {
    font-family: "DynaPuff", system-ui;
    line-height: 5rem;
    font-weight: normal;
    font-style: normal;
    font-size: 8rem;
    text-align: center;

    color: var(--header-color);
    width: fit-content;
    border-radius: 2rem;
    padding: 0.5rem 1rem;
    text-shadow: 0.25rem 0.6rem var(--primary-100);
}

.error__mensaje {
    background-color: var(--background-color);
    border-radius: 1rem;
    box-shadow: 0 0.25rem 0.5rem 0 rgba(0, 0, 0, 0.25);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    padding: 2rem;
    width: 23rem;
}

.mensaje__texto {
    text-align: center;
}
</style>