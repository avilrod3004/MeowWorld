<template>
    <ul v-if="errorsServer">
        <li v-for="error in errorsServer" class="form__error">[ERROR]: {{ error }}</li>
    </ul>
</template>

<script>
export default {
    name: "ErrorsList",
    props: {
        errorsServer: {
            type: Array,
        }
    }
}
</script>

<style scoped>

</style>