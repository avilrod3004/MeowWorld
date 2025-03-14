<template>
<div class="private-layout">
    <Header/>
    <main>
        <AsideResponsive class="aside"/>
        <router-view class="contenido" />
    </main>
    <Footer/>
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
}

main {
    flex: 1;
    padding: 1rem;
    background-color: var(--background-color);
    color: var(--text-color);
    overflow-y: auto; /* Permite que el contenido principal haga scroll */
}

.aside {
    position: sticky;
    top: 0;
    height: 100vh; /* Para ocupar toda la altura de la ventana */
    flex: 0 0 250px; /* Ancho fijo del aside */
    background-color: var(--background-color);
}

.contenido {
    display: flex;
    flex-direction: column;
    width: 100%;
}

@media (min-width: 600px) {
    main {
        display: flex;
    }

}

@media (max-width: 600px) {
    .aside {
        display: none;
    }
}
</style>