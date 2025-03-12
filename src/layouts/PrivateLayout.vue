<template>
<div class="private-layout">
    <Header/>
    <main>
        <router-view />
    </main>
    <Footer/>
</div>
</template>

<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";

export default {
    name: "DefaultLayout",
    components: {
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

    background-color: var(--background-color);
}

main {
    flex: 1;
    padding: 1rem;
}
</style>