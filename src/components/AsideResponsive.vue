<template>
    <nav class="aside__navegacion">
        <ul class="navegacion__listado">
            <li class="listado__opcion">
                <router-link to="/home" class="opcion__enlace">
                    <font-awesome-icon icon="house" class="icono"/>
                    <span class="icono">Inicio</span>
                </router-link>
            </li>
            <li class="listado__opcion">
                <router-link to="/search" class="opcion__enlace">
                    <font-awesome-icon icon="magnifying-glass" class="icono"/>
                    <span class="icono">Búsqueda</span>
                </router-link>
            </li>
            <li class="listado__opcion">
                <router-link to="/newpost" class="opcion__enlace">
                    <font-awesome-icon icon="plus" class="icono"/>
                    <span class="icono">Nuevo post</span>
                </router-link>
            </li>
            <li class="listado__opcion">
                <router-link to="/chats" class="opcion__enlace">
                    <font-awesome-icon icon="message" class="icono"/>
                    <span class="icono">Chats</span>
                </router-link>
            </li>
            <li class="listado__opcion">
                <router-link to="/notifications" class="opcion__enlace">
                    <font-awesome-icon icon="bell" class="icono"/>
                    <span class="icono">Notificaciones</span>
                </router-link>
            </li>
            <li class="listado__opcion">
                <router-link to="/profile" class="opcion__enlace">
                    <font-awesome-icon icon="user" class="icono"/>
                    <span class="icono">Mi perfil</span>
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHouse, faMagnifyingGlass, faPlus, faMessage, faBell, faUser } from "@fortawesome/free-solid-svg-icons";

library.add(faHouse, faMagnifyingGlass, faPlus, faMessage, faBell, faUser);


export default {
    name: "asideResponsive",
    components: { FontAwesomeIcon }
}
</script>

<style scoped>
.aside__navegacion {
    padding: 1rem;
    margin-right: 1rem;
    border-right: 0.1rem solid #ccc;
}

.navegacion__listado {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
}

.listado__opcion {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.opcion__enlace {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.listado__opcion span {
    font-family: "DynaPuff", system-ui;
    font-size: 1.25rem;
}
</style>