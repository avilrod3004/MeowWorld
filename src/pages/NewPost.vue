<template>
    <Spinner v-if="this.loadingPage"/>
    <div v-else>
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
                <span v-if="imageError" class="form__error">{{ imageError }}</span>
            </div>

            <div class="formulario__label-input">
                <label for="descripcion">Añade una descripción:</label>
                <Field name="descripcion" v-slot="{ field }">
                <textarea
                    id="descripcion"
                    class="form__input form__textarea"
                    v-bind="field"
                ></textarea>
                </Field>
                <ErrorMessage name="descripcion" class="form__error" />
            </div>

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
                    <p v-if="!cats">No has registrado ningún gato todavía.</p>
                </Field>
            </div>

            <Spinner v-if="loadingPost"/>
            <button type="submit" class="button__primary">Publicar</button>
            <ErrorsList :errorsServer="this.errorsServer" />
        </Form>
    </div>
</template>

<script>
import placeholderImage from '../assets/gato_6.png';
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from "vee-validate";
import api from "../helpers/api.js";
import ErrorsList from "../components/ErrorsList.vue";
import Spinner from "../components/Spinner.vue";
import {useUserStore} from "../stores/userStore.js";


/**
 * Componente para crear un nuevo post con una imagen y una descripción.
 *
 * Permite seleccionar una imagen, añadir una descripción y asociar gatos al post.
 */
export default {
    name: "NewPost",

    components: {
        Spinner,
        ErrorsList,
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
            loadingPage: true,
            loadingPost: false,
            userId: null,
        };
    },

    methods: {
        /**
         * Obtiene la lista de gatos del usuario desde el servidor.
         */
        async getUserCats() {
            try {
                const responseCats = await api.get(`cats/user/${this.userId}`)
                this.cats = responseCats.data.data;
            } catch (error) {
                console.log(error);
            }
        },

        /**
         * Maneja el cambio de imagen y muestra una vista previa.
         * También valida el tipo de imagen seleccionado.
         */
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

        /**
         * Maneja el cambio en los checkboxes para seleccionar los gatos asociados al post.
         * Actualiza el valor del campo de gatos en el formulario.
         */
        handleCheckboxChange(event, catId, setFieldValue, values) {
            const checked = event.target.checked;

            let updatedCats = Array.isArray(values.gatos) ? [...values.gatos] : [];

            if (checked) {
                if (!updatedCats.includes(catId)) {
                    updatedCats.push(catId);
                }
            } else {
                updatedCats = updatedCats.filter((id) => id !== catId);
            }

            setFieldValue("gatos", updatedCats);

            console.log("Gatos seleccionados:", updatedCats);
        },

        /**
         * Envía el formulario con la imagen seleccionada y la descripción.
         * Si hay gatos seleccionados, los asocia al post.
         * Muestra errores del servidor si ocurren.
         */
        async submitPost(values) {
            if (!this.selectedImage) {
                this.imageError = "Añade la imagen del post.";
                return;
            }

            const formData = new FormData();
            formData.append("image", this.selectedImage);
            formData.append("description", values.descripcion);

            try {
                this.loadingPost = true;
                const responseNewPost = await api.post( "posts", formData);

                if (responseNewPost.status === 201) {
                    const postId = responseNewPost.data.data.id;

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
                    this.loadingPost = false;
                    this.$router.push('/profile');
                }
            } catch (error) {
                this.errorsServer = [];
                this.loadingPost = false;

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

    async created() {
        this.loadingPage = false;
        this.userId = useUserStore().getUser.id;
        await this.getUserCats()
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
