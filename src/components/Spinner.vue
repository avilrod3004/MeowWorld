<template>
    <div class="spinner">
        <div class="spinner__circle"></div>
        <p class="spinner__text">Cargando...</p>
    </div>
</template>

<script>
export default {
    name: 'Spinner'
}
</script>

<style scoped>
.spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;
}

.spinner__circle {
    width: 50px;
    height: 50px;
    border: 5px solid #ccc;
    border-top: 5px solid var(--color-spinner);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.spinner__text {
    margin-top: 1rem;
    font-size: 1.2rem;
    color: #666;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
