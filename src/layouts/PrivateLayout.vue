<template>
<div class="page">
    <div class="private-layout">
        <Header/>
        <main>
            <AsideResponsive class="aside"/>
            <router-view class="contenido" />
        </main>
        <Footer/>
    </div>
</div>
</template>

<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import AsideResponsive from "../components/AsideResponsive.vue";

export default {
    name: "DefaultLayout",
    components: {
        AsideResponsive,
        Header,
        Footer
    }
}
</script>

<style scoped>
.private-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 1000px;
    width: 100%;
    margin: 0 2rem;

    box-shadow: 0 0.25rem 0.5rem 0 rgba(0, 0, 0, 0.25);
}

main {
    flex: 1;
    padding: 1rem;
    background-color: var(--background-color);
    color: var(--text-color);
    overflow-y: auto; /* Permite que el contenido principal haga scroll */
    width: 100%;
}

.aside {
    position: sticky;
    top: 0;
    height: 100vh; /* Para ocupar toda la altura de la pantalla */
    width: 21rem;
    flex: 0 0 21rem; /* Asegura que no se reduzca ni crezca */
    background-color: var(--background-color);
}

.contenido {
    display: flex;
    flex-direction: column;
    flex: 1; /* Hace que el contenido ocupe todo el espacio restante */
    width: 100%; /* Asegura que siempre tome el ancho disponible */
}

@media (min-width: 600px) {
    .page {
        height: 100vh;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .page::before {
        content: "";
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        background-image: url('../assets/wallpaper-400.png');
        background-repeat: repeat;
        opacity: 0.3;
        z-index: -1;
    }

    main {
        display: flex;
    }

}

@media (max-width: 760px) {
    .page::before {
        display: none; /* Oculta el fondo */
    }

    .private-layout {
        margin: 0; /* Elimina los márgenes para ocupar todo el ancho */
        box-shadow: none;
    }

    main {
        width: 100%;
        padding: 1rem;
    }

    .aside {
        display: none;
    }
}

</style>