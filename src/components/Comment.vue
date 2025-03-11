<template>
    <div>
        <img :src="this.comment.user.img_profile" alt="">

        <div>
            <p>{{ this.comment.user.name }}</p>
            <p>@{{ this.comment.user.username }}</p>
            <p>{{ this.comment.text }}</p>
            <p>{{ formatData(this.comment.created_at) }}</p>
        </div>
    </div>
</template>

<script>
import formatData from "../helpers/formatData.js";

export default {
    name: "Comment",
    methods: {formatData},

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