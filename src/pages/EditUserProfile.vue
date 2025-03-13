<template>
    <Spinner v-if="loadingPage"/>
    <Form
        class="formulario"
        @submit="updateUserProfile"
        :validation-schema="schema"
        v-else
    >
        <h1 class="formulario__titulo">Editar perfil</h1>

        <div class="formulario__imagen">
            <img :src="user?.img_profile || defaultImage" alt="Foto de perfil" class="formulario__imagen-preview" />

            <label for="fileInput" class="button__secondary">
                Cambiar imagen
            </label>

            <input
                type="file"
                id="fileInput"
                @change="handleImageChange"
                accept="image/*"
                class="formulario__input-file"
            />
        </div>

        <div class="formulario__label-input">
            <label for="name">Nombre:</label>
            <Field name="name" class="form__input" :value="user?.name" />

            <ErrorMessage name="name" class="form__error"/>
        </div>

        <div class="formulario__label-input">
            <label for="username">Nombre de usuario:</label>
            <Field name="username" class="form__input" :value="user?.username" />

            <ErrorMessage name="username" class="form__error"/>
        </div>

        <div class="formulario__label-input">
            <label for="description">Descripción:</label>
            <Field name="description" class="form__input" as="textarea" :value="user?.description" />

            <ErrorMessage name="description" class="form__error"/>
        </div>

        <Spinner v-if="loadingChanges"/>

        <div class="formulario__buttons">
            <button class="button__cancel button__max" @click="goBack">Cancelar</button>
            <button type="submit" class="button__confirm button__max">Aplicar cambios</button>
        </div>

        <ErrorsList :errors-server="this.errorsServer"/>
    </Form>
</template>

<script>
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from "vee-validate";
import api from "../helpers/api.js";
import defaultImg from '../assets/default_img_profile.png';
import Spinner from "../components/Spinner.vue";
import ErrorsList from "../components/ErrorsList.vue";


export default {
    name: "EditUserProfile",

    components: {
        ErrorsList,
        Spinner,
        Form,
        Field,
        ErrorMessage,
    },

    data() {
        return {
            user: null,
            errorsServer: [],
            schema: yup.object().shape({
                name: yup
                    .string()
                    .required("El nombre es obligatorio")
                    .max(255, "El nombre no puede exceder los 255 caracteres."),
                username: yup
                    .string()
                    .required("El nombre de usuario obligatorio")
                    .max(80, "El nombre de usuario no puede exceder los 80 caracteres."),
                description: yup
                    .string()
                    .optional()
                    .max(2000, "La descripcion no puede exceder los 2000 caracteres.")
            }),
            newImage: null,
            defaultImage: defaultImg,
            loadingPage: true,
            loadingChanges: false,
        }
    },

    methods: {
        async getUserData() {
            try {
                const responseProfile = await api.get('auth/me');
                this.user = responseProfile.data.data;
            } catch (error) {
                console.log(error);
            }
        },

        handleImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.newImage = file;
                // Vista previa de la nueva imagen
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.user.img_profile = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },

        async updateUserProfile(values) {
            try {
                this.loadingChanges = true;
                const formData = new FormData();

                // Comparar los valores del formulario con los datos del usuario
                if (values.name && values.name !== this.user.name) formData.append('name', values.name);
                if (values.username && values.username !== this.user.username) formData.append('username', values.username);
                if (values.description && values.description !== this.user.description) formData.append('description', values.description);
                if (this.newImage) formData.append('img_profile', this.newImage);

                // Verificar si hay datos para enviar
                if (!formData.has('name') && !formData.has('username') && !formData.has('description') && !formData.has('img_profile')) {
                    this.errorsServer = [...this.errorsServer, "No hay cambios para aplicar."];
                    this.loadingChanges = false;
                    return;
                }

                const responseUpdateProfile = await api.post(`users/${this.user.id}/profile`, formData);

                if (responseUpdateProfile.status === 200) {
                    this.loadingChanges = false;
                    this.$router.push("/profile");
                }
            } catch (error) {
                this.errorsServer = [];
                this.loadingChanges = false;

                if (error.response.status === 422) {
                    if ('name' in error.response.data.errors) {
                        this.errorsServer = [...this.errorsServer, ...error.response.data.errors.name];
                    }

                    if ('username' in error.response.data.errors) {
                        this.errorsServer = [...this.errorsServer, ...error.response.data.errors.username];
                    }

                    if ('description' in error.response.data.errors) {
                        this.errorsServer = [...this.errorsServer, ...error.response.data.errors.description];
                    }

                    if ('img_profile' in error.response.data.errors) {
                        this.errorsServer = [...this.errorsServer, ...error.response.data.errors.img_profile];
                    }
                } else {
                    this.errorsServer = [...this.errorsServer, ...error.response.data.errors];
                }
            }
        },

        goBack() {
            this.$router.push("/profile");
        }
    },

    async created() {
        await this.getUserData();
        this.loadingPage = false;
    }
}
</script>

<style scoped>

</style>