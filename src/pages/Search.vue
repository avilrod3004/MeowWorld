<template>
    <div class="contenido">
        <h1 class="titulo">Búsqueda</h1>

        <Form @submit="searchQuery" :validation-schema="schema" class="formulario">
            <Field aria-label="Tipo de cuenta" as="select" name="category" class="form__input" :v-model="selectedCategory">
                <option value="" disabled selected>Categoría</option>
                <option value="users">Usuarios</option>
                <option value="cats">Gatos</option>
            </Field>
            <ErrorMessage name="category" class="form__error"/>

            <Field aria-label="Palabra clave" name="query" class="form__input" placeholder="Palabra clave" />
            <ErrorMessage name="email" class="form__error"/>

            <button type="submit" class="button__primary">Aplicar</button>

            <ErrorsList :errors-server="errors" />
        </Form>

        <section class="resultados">
            <h1 class="titulo">Resultados</h1>

            <Spinner v-if="loading"/>
            <div v-else class="resultados__listados">
                <p v-if="resultsCount">{{ resultsCount }} coincidencia<span v-if="resultsCount > 1">s</span></p>

                <ListProfiles :profiles="this.profiles" :type="this.type" />
            </div>
        </section>
    </div>
</template>

<script>
import * as yup from 'yup';
import {Form, Field, ErrorMessage} from "vee-validate";
import api from "../helpers/api.js";
import Spinner from "../components/Spinner.vue";
import ErrorsList from "../components/ErrorsList.vue";
import ListProfiles from "../components/ListProfiles.vue";

export default {
    name: "Search",

    components: {
        ListProfiles,
        ErrorsList,
        Spinner,
        Form,
        Field,
        ErrorMessage,
    },

    data() {
        return {
            errors: [],
            loading: false,
            selectedCategory: '',
            schema: yup.object().shape({
                query: yup.string(),
                category: yup.string().required("Selecciona una categoría"),
            }),
            resultsCount: null,
            profiles: null,
            type: null,
        }
    },

    methods: {
        async searchQuery(values) {
            this.loading = true;
            this.errors = [];

            const { query, category } = values;

            try {
                let response;
                if (category === "users") {
                    response = await api.get(`/users/filter?query=${query}`);

                    if (response.status === 200) {
                        this.profiles = null;
                        this.type = null;

                        this.profiles = response.data.data;
                        this.resultsCount = response.data.meta.total;
                        this.type = "users"
                    }
                } else if (category === "cats") {
                    response = await api.get(`/cats/filter?query=${query}`);

                    if (response.status === 200) {
                        this.profiles = null;
                        this.type = null;

                        this.profiles = response.data.data;
                        this.resultsCount = response.data.meta.total;
                        this.type = "cats"
                    }
                } else if (category === "posts") {
                    response = await api.get(`/posts?search=${query}`);
                }
                this.loading = false;
            } catch (error) {
                this.errors = error.response?.data.errors || ["Ha ocurrido un error al realizar la búsqueda. Vuelva a intentarlo más tarde."];

                this.loading = false;
            }
        },
    }

}
</script>

<style scoped>
.contenido {
    display: flex;
    flex-direction: column;
}

.titulo {
    font-family: "DynaPuff", system-ui;
    font-size: 2rem;
}

.formulario {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    border-bottom: 0.1rem solid #ccc;
    padding: 1rem 0
}

.resultados {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    padding-top: 1rem;
}

.resultados__listados {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>