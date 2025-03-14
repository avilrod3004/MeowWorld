<template>
    <div class="perfil__datos">
        <img :src="this?.imgProfile" alt="" class="datos__imagen">

        <div class="datos__listado">
            <p class="listado__nombre">{{ this.name }}</p>

            <p v-if="type === 'cat'" class="listado__username">Usuario: @{{ this.username }}</p>
            <p v-else class="listado__username">@{{ this.username }}</p>
        </div>
        <p class="datos__descripcion">{{ this.description }}</p>
    </div>
</template>

<script>
/**
 * Componente que muestra los datos del perfil de un usuario o gato, incluyendo su nombre,
 * nombre de usuario, descripción e imagen de perfil.
 */
export default {
    name: "ProfileData",

    props: {
        id: {
            type: Number,
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
        description: {
            type: String,
            required: true
        },
        imgProfile: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped lang="scss">
.perfil__datos {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.datos__imagen {
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 50%;
    object-fit: cover;
}

.datos__listado {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.listado__nombre {
    font-family: "DynaPuff", system-ui;
    font-weight: normal;
    font-style: normal;
    font-size: 2rem;
}

.datos__descripcion {
    width: 100%;
}
</style>