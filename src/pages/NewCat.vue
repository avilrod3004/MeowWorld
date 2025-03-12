<template>
    <Form
        class="formulario"
        @submit="registerCat"
        :validation-schema="schema"
        :initial-values="{ en_adopcion: false }"
    >
        <h1 class="formulario__titulo">Registrar gato</h1>

        <div class="formulario__imagen">
            <img :src="imagePreview || defaultImage" alt="Foto de perfil" class="formulario__imagen-preview" />

            <label for="fileInput" class="button__secondary">
                Subir imagen
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
            <Field name="name" class="form__input" />

            <ErrorMessage name="name" class="form__error"/>
        </div>

        <div class="formulario__label-input">
            <label for="description">Descripción:</label>
            <Field name="description" class="form__input" as="textarea" />

            <ErrorMessage name="description" class="form__error"/>
        </div>

        <div class="formulario__input-adopcion">
            <Field
                name="en_adopcion"
                v-slot="{ field }"
            >
                <input
                    type="checkbox"
                    v-bind="field"
                    @change="field.onChange($event.target.checked)"
                    class="form__checkbox"
                />
            </Field>
            <label for="en_adopcion">En adopción</label>
        </div>

        <div class="formulario__buttons">
            <button class="button__cancel button__max" @click="goBack">Cancelar</button>
            <button type="submit" class="button__confirm button__max">Aplicar cambios</button>
        </div>

        <ul>
            <li v-for="error in this.errorsServer" class="form__error">{{ error }}</li>
        </ul>
    </Form>
</template>

<script>
import * as yup from "yup";
import defaultImg from "../assets/default_img_profile.png";
import api from "../helpers/api.js";
import {ErrorMessage, Field, Form} from "vee-validate";

export default {
    name: "NewCat",
    components: {Form, Field, ErrorMessage},

    data() {
        return {
            errorsServer: [],
            schema: yup.object().shape({
                name: yup
                    .string()
                    .required("El nombre es obligatorio")
                    .max(255, "El nombre no puede exceder los 255 caracteres."),
                description: yup
                    .string()
                    .required("La descripción es obligatorio")
                    .max(2000, "La descripcion no puede exceder los 2000 caracteres."),
                en_adopcion: yup
                    .boolean()
                    .optional()
                    .default(false)
            }),
            newImage: null,
            imagePreview: null,
            defaultImage: defaultImg,
        }
    },

    methods: {
        handleImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.newImage = file;
                // Vista previa de la nueva imagen
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },

        async registerCat(values) {
            try {
                const formData = new FormData();

                // Comparar los valores del formulario con los datos del usuario
                formData.append('name', values.name);
                formData.append('description', values.description);
                formData.append('image', this.newImage);
                formData.append('en_adopcion', values.en_adopcion);

                const responseUpdateProfile = await api.post(`cats/`, formData);

                if (responseUpdateProfile.status === 201) {
                    this.$router.push(`/cat/${responseUpdateProfile.data.data.id}`);
                }
            } catch (error) {
                this.errorsServer = [];

                if (error.response.status === 422) {
                    if ('name' in error.response.data.errors) {
                        this.errorsServer = [...this.errorsServer, ...error.response.data.errors.name];
                    }

                    if ('description' in error.response.data.errors) {
                        this.errorsServer = [...this.errorsServer, ...error.response.data.errors.description];
                    }

                    if ('image' in error.response.data.errors) {
                        this.errorsServer = [...this.errorsServer, ...error.response.data.errors.image];
                    }

                    if ('en_adopcion' in error.response.data.errors) {
                        this.errorsServer = [...this.errorsServer, ...error.response.data.errors.en_adopcion];
                    }
                } else {
                    this.errorsServer = [...this.errorsServer, ...error.response.data.errors];
                }
            }
        },

        goBack() {
            this.$router.push(`/profile`);
        }
    }
}
</script>

<style scoped>

</style>