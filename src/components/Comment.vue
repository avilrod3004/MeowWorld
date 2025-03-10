<template>
    <div>
        <img :src="this.comment.user.img_profile" alt="">

        <div>
            <p>{{ this.comment.user.name }}</p>
            <p>@{{ this.comment.user.username }}</p>
            <p>{{ this.comment.text }}</p>
            <div>
                <img src="" alt="">
                10 me gustas
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Comment",

    props: {
        comment: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>

</style>