<template>
    <div class="public-layout">
        <router-view />
    </div>
</template>

<script>
export default {
    name: "PublicLayout"
}
</script>

<style scoped>
.public-layout {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
}
</style>