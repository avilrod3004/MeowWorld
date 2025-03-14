<template>
<footer class="footer">
    <nav class="footer__navegacion">
        <ul class="navegacion__listado">
            <li class="listado__opcion"><router-link to="/home" class="opcion__enlace"><font-awesome-icon icon="house" class="icono"/></router-link></li>
            <li class="listado__opcion"><router-link to="/search" class="opcion__enlace"><font-awesome-icon icon="magnifying-glass" class="icono"/></router-link></li>
            <li class="listado__opcion"><router-link to="/newpost" class="opcion__enlace"><font-awesome-icon icon="plus" class="icono"/></router-link></li>
            <li class="listado__opcion"><router-link to="/chats" class="opcion__enlace"><font-awesome-icon icon="message" class="icono"/></router-link></li>
            <li class="listado__opcion"><router-link to="/notifications" class="opcion__enlace"><font-awesome-icon icon="bell" class="icono"/></router-link></li>
            <li class="listado__opcion"><router-link to="/profile" class="opcion__enlace"><font-awesome-icon icon="user" class="icono"/></router-link></li>
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
    components: { FontAwesomeIcon }
}
</script>

<style scoped lang="scss">
.footer {
    border-top: 1px solid black;
    padding: 1rem;

    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: var(--background-color);
    z-index: 10;
}

@media (min-width: 600px) {
    footer {
        display: none;
    }
}

.navegacion__listado {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}
</style>