<template>
    <h1 class="settings__title">Configuracion</h1>

    <section class="settings__section">
        <div class="settings__group">
            <h2 class="group__title">Gestion usuario</h2>
            <ul class="group__list">
                <li class="list__option">
                    <font-awesome-icon icon="envelope" class="icono"/>
                    Cambiar email
                </li>
                <li class="list__option">
                    <font-awesome-icon icon="key" class="icono"/>
                    Cambiar contraseña
                </li>
                <li class="list__option">
                    <font-awesome-icon icon="power-off" class="icono"/>
                    Cerrar sesión
                </li>
            </ul>
        </div>

        <div class="settings__group">
            <h2 class="group__title">Gestion gatos</h2>
            <ul class="group__list">
                <li class="list__option">
                    <font-awesome-icon icon="cat" class="icono"/>
                    Borrar gato
                </li>
            </ul>
        </div>

        <div class="settings__group">
            <h2 class="group__title">Apariencia</h2>
            <ul class="group__list">
                <li @click="changeTheme" class="list__option">
                    <font-awesome-icon icon="circle-half-stroke" class="icono"/>
                    Modo oscuro
                </li>
            </ul>
        </div>

        <div class="settings__group">
            <h2 class="group__title">Contactanos</h2>
            <ul class="group__list">
                <li class="list__option">
                    <font-awesome-icon icon="triangle-exclamation" class="icono"/>
                    Informar de un problema
                </li>
            </ul>
        </div>

        <div class="settings__group">
            <h2 class="group__title">Otros</h2>
            <ul class="group__list">
                <li class="list__option">
                    <font-awesome-icon icon="code" class="icono"/>
                    <a href="https://github.com/avilrod3004/MeowWorld" target="_blank">Repositorio</a>
                </li>
                <li class="list__option">
                    <font-awesome-icon icon="info-circle" class="icono"/>
                    Politica de privacidad
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleHalfStroke, faPowerOff, faKey, faEnvelope, faCat, faTriangleExclamation, faCode, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

library.add(faCircleHalfStroke, faPowerOff, faKey, faEnvelope, faCat, faTriangleExclamation, faCode, faInfoCircle);

export default {
    name: "Configuration",
    components: {FontAwesomeIcon},

    methods: {
        changeTheme() {
            const body = document.body;
            const currentTheme = body.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            body.setAttribute("data-theme", newTheme);
        }
    }
}
</script>

<style scoped>
.settings__title {
    font-family: "DynaPuff", system-ui;
    font-size: 2rem;

    margin-bottom: 2rem;
}

.group__title {
    font-size: 1.5rem;
}

.settings__section {
    display: flex;
    flex-direction: column;
}

.settings__group {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    margin-bottom: 2rem;
}

.group__list {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    padding-left: 1rem;
}

.list__option {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

</style>