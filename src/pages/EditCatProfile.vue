<template>
    <Spinner v-if="loadingPage" />
    <Form
        class="formulario"
        @submit="updateCatProfile"
        :validation-schema="schema"
        v-else
    >
        <h1 class="formulario__titulo">Editar perfil</h1>

        <div class="formulario__imagen">
            <img :src="cat?.image || defaultImage" alt="Foto de perfil" class="formulario__imagen-preview" />

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
            <Field name="name" class="form__input" :value="cat?.name" />

            <ErrorMessage name="name" class="form__error"/>
        </div>

        <div class="formulario__label-input">
            <label for="description">Descripción:</label>
            <Field name="description" class="form__input" as="textarea" :value="cat?.description" />

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
                    :checked="cat.en_adopcion"
                    @change="field.onChange($event.target.checked)"
                    class="form__checkbox"
                />
            </Field>
            <label for="en_adopcion">En adopción</label>
        </div>

        <Spinner v-if="loadingChanges" />

        <div class="formulario__buttons">
            <button class="button__cancel button__max" @click="goBack">Cancelar</button>
            <button type="submit" class="button__confirm button__max">Aplicar cambios</button>
        </div>

        <ErrorsList :errors-server="this.errorsServer" />
    </Form>
</template>

<script>
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from "vee-validate";
import api from "../helpers/api.js";
import defaultImg from '../assets/default_img_profile.png';
import ErrorsList from "../components/ErrorsList.vue";
import Spinner from "../components/Spinner.vue";

export default {
    name: "EditCatProfile",

    components: {
        Spinner,
        ErrorsList,
        Form,
        Field,
        ErrorMessage,
    },

    data() {
        return {
            cat: null,
            errorsServer: [],
            schema: yup.object().shape({
                name: yup
                    .string()
                    .required("El nombre es obligatorio")
                    .max(255, "El nombre no puede exceder los 255 caracteres."),
                description: yup
                    .string()
                    .optional()
                    .max(2000, "La descripcion no puede exceder los 2000 caracteres."),
                en_adopcion: yup
                    .boolean()
                    .optional()
            }),
            newImage: null,
            defaultImage: defaultImg,
            loadingPage: true,
            loadingChanges: false,
        }
    },

    methods: {
        async getCatData() {
            try {
                const responseCatProfile = await api.get(`cats/${this.catId}`);
                this.cat = responseCatProfile.data.data
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
                    this.cat.image = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },

        async updateCatProfile(values) {
            try {
                this.loadingChanges = true;
                const formData = new FormData();

                if (values.name && values.name !== this.cat.name) formData.append('name', values.name);
                if (values.description && values.description !== this.cat.description) formData.append('description', values.description);
                if (this.newImage) formData.append('image', this.newImage);
                if (values.en_adopcion !== this.cat.en_adopcion) {
                    formData.append('en_adopcion', values.en_adopcion);
                }

                if (!formData.has('name') && !formData.has('description') && !formData.has('image') && !formData.has('en_adopcion')) {
                    this.errorsServer = [...this.errorsServer, "No hay cambios para aplicar."];
                    this.loadingChanges = false;
                    return;
                }

                const responseUpdateProfile = await api.post(`cats/${this.catId}`, formData);

                if (responseUpdateProfile.status === 200) {
                    this.loadingChanges = false;
                    this.$router.push(`/cat/${this.catId}`);
                }
            } catch (error) {
                this.errorsServer = [];
                this.loadingChanges = false;

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
            this.$router.push(`/cat/${this.catId}`);
        }
    },

    async created() {
        this.catId = this.$route.params.id;
        await this.getCatData();

        this.loadingPage = false;
    }
}
</script>

<style scoped>
.formulario__input-adopcion {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
</style>