<template>
    <div v-if="type === 'users'">
        <ul v-if="profiles && profiles.length > 0" class="listado">
            <li v-for="user in profiles" :key="user.id" @click="gotToUserProfile(user.id)" class="cuenta">
                <img :src="user?.img_profile || defaultImage" alt="" class="img__profile">
                <div class="cuenta__nombres">
                    <p class="nombres__nombre">{{ user.name }}</p>
                    <p>@{{ user.username }}</p>
                </div>
            </li>
        </ul>
        <p v-if="profiles && profiles.length === 0" class="sin_resultado">No hay usuarios que tengan ese nombre.</p>
    </div>

    <div v-if="type === 'cats'" class="listado">
        <ul v-if="profiles && profiles.length > 0" class="listado">
            <li v-for="cat in profiles" :key="cat.id" @click="goToCatProfile(cat.id)" class="cuenta">
                <img :src="cat?.image || defaultImage" alt="" class="img__profile">
                <div class="cuenta__nombres">
                    <p class="nombres__nombre">{{ cat.name }}</p>
                    <p>@{{ cat.owner.username }}</p>
                </div>
            </li>
        </ul>
        <p v-if="profiles && profiles.length === 0" class="sin_resultado">No hay gatos que tengan ese nombre.</p>
    </div>
</template>

<script>
import defaultImg from '../assets/default_img_profile.png';
import {useUserStore} from "../stores/userStore.js";

export default {
    name: "ListProfiles",

    data() {
        return {
            defaultImage: defaultImg,
        }
    },

    props: {
        profiles: {
            required: true,
        },
        type: {
            type: String,
            required: true,
        }
    },

    methods: {
        goToCatProfile(catId) {
            this.$router.push({ path: `/cat/${catId}` });
        },

        gotToUserProfile(userId) {
            if (useUserStore().getUser.id === userId) {
                this.$router.push("/profile");
            } else {
                this.$router.push({ name: 'OtherUserProfile', params: { id: userId } });
            }
        }
    }
}
</script>

<style scoped>
.cuenta {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    cursor: pointer;

    padding: 1rem 0.5rem;
    border-bottom: 0.1rem solid #ccc;
}

.img__profile {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    object-fit: cover;
}

.cuenta__nombres {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.nombres__nombre {
    font-family: "DynaPuff", system-ui;
    font-size: 1.25rem;
}
</style>