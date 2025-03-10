<template>
<footer class="footer">
    <nav class="footer__navegacion">
        <ul class="navegacion__listado">
            <li class="listado__opcion"><router-link to="/home" class="opcion__enlace"><font-awesome-icon icon="house" class="icono__footer"/></router-link></li>
            <li class="listado__opcion"><router-link to="/search" class="opcion__enlace"><font-awesome-icon icon="magnifying-glass" class="icono__footer"/></router-link></li>
            <li class="listado__opcion"><router-link to="/newpost" class="opcion__enlace"><font-awesome-icon icon="plus" class="icono__footer"/></router-link></li>
            <li class="listado__opcion"><router-link to="/chats" class="opcion__enlace"><font-awesome-icon icon="message" class="icono__footer"/></router-link></li>
            <li class="listado__opcion"><router-link to="/notifications" class="opcion__enlace"><font-awesome-icon icon="bell" class="icono__footer"/></router-link></li>
            <li class="listado__opcion"><router-link to="/profile" class="opcion__enlace"><font-awesome-icon icon="user" class="icono__footer"/></router-link></li>
        </ul>
    </nav>
</footer>
</template>

<script>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHouse, faMagnifyingGlass, faPlus, faMessage, faBell, faUser } from "@fortawesome/free-solid-svg-icons";

library.add(faHouse, faMagnifyingGlass, faPlus, faMessage, faBell, faUser);

export default {
    name: "Footer",
    components: {FontAwesomeIcon}
}
</script>

<style scoped lang="scss">
.footer {
    border: 1px solid black;
}

.navegacion__listado {
    display: flex;
    justify-content: space-between;
    gap: 1rem;

    margin: 1rem;
}

.icono__footer {
    font-size: 1.5rem;
    color: var(--icon-color);
    transition: color 0.3s ease;
}

.router-link-active .icono__footer {
    color: var(--icon-color-active);
}
</style>