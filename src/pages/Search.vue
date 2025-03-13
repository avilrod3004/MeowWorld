<template>
    <h1>Busqueda</h1>

    <Form @submit="searchQuery" :validation-schema="schema" class="formulario">
        <Field as="select" name="category" class="form__input" :v-model="selectedCategory">
            <option value="" disabled selected>Categoría</option>
            <option value="users">Usuarios</option>
            <option value="cats">Gatos</option>
            <option value="posts">Posts</option>
        </Field>
        <ErrorMessage name="category" class="form__error"/>

        <Field name="query" class="form__input" placeholder="Palabra clave" />
        <ErrorMessage name="email" class="form__error"/>

        <button type="submit" class="button__primary">Aplicar</button>
    </Form>

    <section>
        <h1>Resultados</h1>
        <p v-if="resultsCount">{{ resultsCount }} coincidencia<span v-if="resultsCount > 1">s</span></p>

        <ul v-if="users && users.length > 0">
            <li v-for="user in users" :key="user.id" @click="gotToUserProfile(user.id)" class="item">
                <img :src="user.img_profile" alt="">
                <p>{{ user.name }}</p>
                <p>{{ user.username }}</p>
            </li>
        </ul>
        <p v-if="users && users.length === 0">No hay usuarios que tengan ese nombre</p>

        <ul v-if="cats && cats.length > 0">
            <li v-for="cat in cats" :key="cat.id" @click="goToCatProfile(cat.id)" class="item">
                <img :src="cat.image" alt="">
                <p>{{ cat.name }}</p>
                <p>{{ cat.owner.username }}</p>
            </li>
        </ul>
        <p v-if="cats && cats.length === 0">No hay gatos que tengan ese nombre</p>
    </section>
</template>

<script>
import * as yup from 'yup';
import {Form, Field, ErrorMessage} from "vee-validate";
import api from "../helpers/api.js";

export default {
    name: "Search",

    components: {
        Form,
        Field,
        ErrorMessage,
    },

    data() {
        return {
            errors: [],
            selectedCategory: '',
            schema: yup.object().shape({
                query: yup.string(),
                category: yup.string().required("Selecciona una categoría"),
            }),
            users: null,
            cats: null,
            posts: null,
            resultsCount: null,
        }
    },

    methods: {
        async searchQuery(values) {
            this.errors = [];

            // Obtenemos la query y la categoría seleccionada
            const { query, category } = values;

            try {
                // Dependiendo de la categoría seleccionada, hacemos la llamada API correspondiente
                let response;
                if (category === "users") {
                    response = await api.get(`/users/filter?query=${query}`);

                    if (response.status === 200) {
                        this.users = null;
                        this.cats = null;
                        this.posts = null;

                        this.users = response.data.data;
                        this.resultsCount = response.data.meta.total;
                    }
                } else if (category === "cats") {
                    response = await api.get(`/cats/filter?query=${query}`);

                    if (response.status === 200) {
                        this.users = null;
                        this.cats = null;
                        this.posts = null;

                        this.cats = response.data.data;
                        this.resultsCount = response.data.meta.total;
                    }
                } else if (category === "posts") {
                    response = await api.get(`/posts?search=${query}`);
                }

                // Aquí puedes manejar la respuesta de la API, por ejemplo, actualizar el estado o mostrar resultados
                console.log(response.data.data);
            } catch (error) {
                console.log("Error en la búsqueda:", error);
                this.errors.push("Hubo un error al realizar la búsqueda.");
            }
        },

        goToCatProfile(catId) {
            this.$router.push({ path: `/cat/${catId}` });
        },

        gotToUserProfile(userId) {
            this.$router.push({ name: 'OtherUserProfile', params: { id: userId } });
        }
    }

}
</script>

<style scoped>
.formulario {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    border-bottom: 0.1rem solid #ccc;
    padding: 1rem 0
}

.item {
    cursor: pointer;
}
</style>