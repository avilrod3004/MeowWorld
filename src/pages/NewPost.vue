<template>
    <Form
        @submit="submitPost"
        :validation-schema="schema"
        v-slot="{ values, errors, setFieldValue }"
        class="formulario"
    >
        <h1 class="formulario__titulo">Nuevo post</h1>

        <div>
            <label for="imagen" class="formulario__label-image">
                <img :src="imagePreview || placeholderImage" alt="Subir imagen" class="img__preview">
                <span class="label-image__text">Subir imagen</span>
            </label>

            <input
                type="file"
                id="imagen"
                name="imagen"
                accept="image/*"
                class="formulario__input-image"
                @change="handleImageChange"
            />
            <span v-if="imageError" class="error">{{ imageError }}</span>
        </div>

        <!-- Descripción -->
        <div class="formulario__label-input">
            <label for="descripcion">Añade una descripción:</label>
            <Field name="descripcion" v-slot="{ field }">
                <textarea
                    id="descripcion"
                    class="form__input form__textarea"
                    v-bind="field"
                ></textarea>
            </Field>
            <ErrorMessage name="descripcion" class="error" />
        </div>

        <!-- Checkboxes -->
        <div class="formulario__label-input">
            <label>¿Quién aparece en la foto?</label>

            <Field name="gatos" v-slot="{ field, value }">
                <div v-for="(cat, index) in cats" :key="index" class="form__checkbox">
                    <input
                        type="checkbox"
                        :id="'opcion' + index"
                        :value="cat"
                        :checked="value?.includes(cat)"
                        @change="(e) => handleCheckboxChange(e, cat, setFieldValue)"
                    />
                    <label :for="'opcion' + index">{{ cat }}</label>
                </div>
            </Field>
        </div>

        <button type="submit" class="button__primary">Publicar</button>

        <ul>
            <li v-for="error in this.errorsServer" class="form__error">{{ error }}</li>
        </ul>
    </Form>
</template>

<script>
import placeholderImage from '../assets/gato_6.png';
import axios from 'axios';
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from "vee-validate";
import api from "../helpers/api.js";

export default {
    name: "NewPost",

    components: {
        Form,
        Field,
        ErrorMessage,
    },

    data() {
        return {
            placeholderImage,
            imagePreview: null,
            imageError: '',
            selectedImage: null,
            cats: ["Misifú", "Pelusa", "Garfiel", "Bigotes"],
            schema: yup.object().shape({
                descripcion: yup
                    .string()
                    .trim()
                    .required("Añade una descripción de la imagen del post.")
                    .max(2000, "La descripción debe tener una longitud máxima de 2000 caracteres"),
                gatos: yup.array().default([]),
            }),
            errorsServer: [],
        };
    },

    methods: {
        handleImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

                if (!allowedTypes.includes(file.type)) {
                    this.imageError = "Formato no válido. Por favor, sube una imagen JPEG, PNG, JPG o WEBP.";
                    return;
                }

                this.imageError = '';
                this.imagePreview = URL.createObjectURL(file);
                this.selectedImage = file;
            }
        },

        handleCheckboxChange(event, cat, setFieldValue) {
            const checked = event.target.checked;
            let updatedCats = event.target.form.elements['gatos']?.value || [];

            updatedCats = Array.isArray(updatedCats) ? updatedCats : [];

            if (checked) {
                updatedCats.push(cat);
            } else {
                updatedCats = updatedCats.filter((c) => c !== cat);
            }

            setFieldValue('gatos', updatedCats);
        },

        async submitPost(values) {
            if (!this.selectedImage) {
                this.imageError = "Añade la imagen del post.";
                return;
            }

            const formData = new FormData();
            formData.append("image", this.selectedImage);
            formData.append("description", values.descripcion);
            // formData.append("gatos", JSON.stringify( values.gatos === undefined ? [] :values.gatos));


            try {
                const responseNewPost = await api.post( import.meta.env.VITE_BASE_API + "posts", formData);

                if (responseNewPost.status === 201) {
                    this.$router.push('/profile');
                }
            } catch (error) {
                this.errorsServer = [];

                if (error.response.status === 422) {
                    if ('image' in error.response.data.errors) {
                        this.errorsServer = [...this.errorsServer, ...error.response.data.errors.image];
                    }

                    if ('description' in error.response.data.errors) {
                        this.errorsServer = [...this.errorsServer, ...error.response.data.errors.description];
                    }
                } else {
                    this.errorsServer = [...this.errorsServer, ...error.response.data.errors];
                }
            }
        }
    }
};
</script>

<style scoped>
.formulario {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.formulario__titulo {
    font-family: "DynaPuff", system-ui;
    font-size: 2rem;
}

.formulario__label-image {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    width: 100%;
    padding: 1rem;
    border: 0.25rem dashed var(--input-image-border-color);
    border-radius: 0.5rem;

    cursor: pointer;
    transition: border-color 0.3s ease;
    overflow: hidden;
}

.formulario__input-image {
    display: none;
}

.label-image__text {
    font-family: "DynaPuff", system-ui;
    color: var(--input-image-border-color);
    font-size: 1.5rem;
}

.formulario__label-input {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.img__preview {
    width: 12rem;
    height: 12rem;
    object-fit: contain;
    border-radius: 8px;
}
</style>
