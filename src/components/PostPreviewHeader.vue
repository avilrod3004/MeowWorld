<template>
<div class="post__user">
    <img :src="this.img_profile" alt="devolver imagen desde la api!!" class="user__image">

    <div class="user__data">
        <div class="data__names">
            <p class="names__name">{{ this.name }}</p>
            <p class="names__username" @click="visitUserProfile">@{{ this.username }}</p>
        </div>
        <p class="data__date">{{ formatData(this.created_at) }}</p>
    </div>
</div>
</template>

<script>
import formatData from "../helpers/formatData.js";
import axios from "axios";

export default {
    name: "PostPreviewHeader",
    methods: {
        formatData,

        async visitUserProfile() {
            // try {
            //     // const responseUserProfile = await axios.get(`users/${this.id}`, {})
            //
            // } catch (error) {
            //     console.error(error);
            // }
            // this.$router.push(`/cat/${catId}`);
        }
    },

    props: {
        id: {
            type: Number,
            required: true
        },
        img_profile: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        created_at: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>
.post__user {
    display: flex;
    gap: 0.5rem;
}

.user__image {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    object-fit: cover;
}

.user__data {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.data__names {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.names__name {
    font-family: "DynaPuff", system-ui;
    font-size: 1.25rem;
}
</style>