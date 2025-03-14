<template>
    <h1 class="settings__title">Configuracion</h1>

    <section class="settings__section">
        <div class="settings__group">
            <h2 class="group__title">Gestion usuario</h2>
            <ul class="group__list">
                <li class="list__option" @click="showModalEditEmail = true">
                    <font-awesome-icon icon="envelope" class="icono"/>
                    Cambiar email
                </li>

                <Modal :is-open="showModalEditEmail">
                    <Form @submit="updateEmail" :validation-schema="schemaEmail" class="modal__formulario">
                        <label for="email">Escribe el nuevo email:</label>
                        <Field name="email" class="form__input" placeholder="Nuevo email"/>
                        <ErrorMessage name="email" class="form__error" />

                        <div class="modal__buttons">
                            <button class="button__cancel" @click="showModalEditEmail = false">Cancelar</button>
                            <button class="button__confirm" type="submit">Actualizar</button>
                        </div>
                    </Form>
                </Modal>

                <li class="list__option" @click="showModalEditPassword = true">
                    <font-awesome-icon icon="key" class="icono"/>
                    Cambiar contraseña
                </li>

                <Modal :is-open="showModalEditPassword">
                    <Form @submit="updatePassword" :validation-schema="schemaPassword" class="modal__formulario">
                        <label for="password">Escribe la nueva contraseña:</label>
                        <Field type="password" name="password" class="form__input" placeholder="Nueva contraseña"/>
                        <ErrorMessage name="password" class="form__error" />

                        <label for="password_confirmation">Repite la nueva contraseña:</label>
                        <Field type="password" name="password_confirmation" class="form__input" placeholder="Repite la constraseña"/>
                        <ErrorMessage name="password_confirmation" class="form__error" />

                        <div class="modal__buttons">
                            <button class="button__cancel" @click="showModalEditPassword = false">Cancelar</button>
                            <button class="button__confirm" type="submit">Actualizar</button>
                        </div>
                    </Form>
                </Modal>


                <li @click="logout" class="list__option">
                    <font-awesome-icon icon="power-off" class="icono"/>
                    Cerrar sesión
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
import api from "../helpers/api.js";
import {mapState} from "pinia";
import {useUserStore} from "../stores/userStore.js";
import Modal from "../modals/Modal.vue";
import * as yup from 'yup';
import {Form, Field, ErrorMessage} from "vee-validate";

library.add(faCircleHalfStroke, faPowerOff, faKey, faEnvelope, faCat, faTriangleExclamation, faCode, faInfoCircle);

export default {
    name: "Configuration",

    components: {
        Modal,
        FontAwesomeIcon,
        Form,
        Field,
        ErrorMessage,
    },

    data() {
        return {
            showModalEditEmail: null,
            showModalEditPassword: null,
            schemaEmail: yup.object().shape({
                email: yup
                    .string()
                    .trim()
                    .required('Ingrese el email')
                    .email('El formato del email no es válido')
                    .matches(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm, 'El formato del email no es válido'),

            }),
            schemaPassword: yup.object().shape({
                password: yup
                    .string()
                    .trim()
                    .required("Ingrese la contraseña")
                    .matches(
                        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                        "La contraseña no cumple los requisitos. Debe tener una longitud mínima de 8 caracteres y contener una letra en mayúscula, un número y un caracter especial."
                    ),
                password_confirmation: yup
                    .string()
                    .trim()
                    .oneOf([yup.ref("password"), null], "Las contraseñas deben coincidir")
                    .required("Por favor, repita la contraseña")

            })
        }
    },

    computed: {
        ...mapState(useUserStore, ["user"]),
    },

    methods: {
        changeTheme() {
            const body = document.body;
            const currentTheme = body.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            body.setAttribute("data-theme", newTheme);
        },

        async updateEmail(values) {
            try {
                const responseUpdate = await api.post(`users/${useUserStore().getUser.id}/credentials`,
                    {
                        email: values.email,
                    }
                );

                if (responseUpdate.status === 200) {
                    console.log("email actualizado");
                    this.showModalEditEmail = false;
                }
            } catch (error) {
                console.log(error.message);
            }
        },

        async updatePassword(values) {
            try {
                const responseUpdate = await api.post(`users/${useUserStore().getUser.id}/credentials`,
                    {
                        password: values.password,
                        password_confirmation: values.password_confirmation
                    }
                );

                if (responseUpdate.status === 200) {
                    console.log("contraseña actualizada actualizado");
                    useUserStore().logout();
                    localStorage.removeItem('token');
                    window.location.href = '/';
                }
            } catch (error) {
                console.log(error.message);
            }
        },

        async logout() {
            try {
                const response = await api.get('auth/logout');

                if (response.status === 200) {
                    useUserStore().logout();
                    localStorage.removeItem('token');
                    window.location.href = '/';
                }
            } catch (error) {
                console.log(error);
            }
        },
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

    cursor: pointer;
}

</style>