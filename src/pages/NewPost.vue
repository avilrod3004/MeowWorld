<template>
    <Form
        @submit="submitPost"
        :validation-schema="schema"
        v-slot="{ values, errors, setFieldValue }"
        class="formulario"
        :initial-values="{ gatos: [] }"
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

            <Field name="gatos" v-slot="{ field }">
                <div v-for="(cat, index) in cats" :key="index" class="form__checkbox">
                    <input
                        type="checkbox"
                        :id="'opcion' + index"
                        :value="cat.id"
                        :checked="field.value.includes(cat.id)"
                        @change="handleCheckboxChange($event, cat.id, setFieldValue, values)"
                    />
                    <label :for="'opcion' + index">{{ cat.name }}</label>
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
            cats: null,
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
        async getUserCats() {
            try {
                const responseCats = await api.get(`cats/user/2`)
                this.cats = responseCats.data.data;
            } catch (error) {
                console.log(error);
            }
        },

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

        handleCheckboxChange(event, catId, setFieldValue, values) {
            const checked = event.target.checked;

            // Asegúrate de que values.gatos sea un array
            let updatedCats = Array.isArray(values.gatos) ? [...values.gatos] : [];

            if (checked) {
                if (!updatedCats.includes(catId)) {
                    updatedCats.push(catId);
                }
            } else {
                updatedCats = updatedCats.filter((id) => id !== catId);
            }

            // Actualizar el valor del campo "gatos"
            setFieldValue("gatos", updatedCats);

            console.log("Gatos seleccionados:", updatedCats); // 🔍 Verifica los valores
        },


        async submitPost(values) {
            console.log("Valores del formulario:", values); // <-- Revisa los valores completos
            console.log("Gatos seleccionados:", values.gatos);

            if (!this.selectedImage) {
                this.imageError = "Añade la imagen del post.";
                return;
            }

            const formData = new FormData();
            formData.append("image", this.selectedImage);
            formData.append("description", values.descripcion);

            try {
                const responseNewPost = await api.post( "posts", formData);

                if (responseNewPost.status === 201) {
                    const postId = responseNewPost.data.data.id;

                    console.log(values.gatos); // --> undefined ??

                    // Registrar la relacion entre el post y los gatos seleccionados
                    if (values.gatos && values.gatos.length > 0) {
                        await Promise.all(
                            values.gatos.map(async (catId) => {
                                await api.post('catpost', {
                                    post_id: postId,
                                    cat_id: catId,
                                });
                            })
                        );
                    }

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
    },

    created() {
        this.getUserCats()
    }
};
</script>

<style scoped>
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

.img__preview {
    width: 12rem;
    height: 12rem;
    object-fit: contain;
    border-radius: 8px;
}
</style>
