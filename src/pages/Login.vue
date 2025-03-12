<template>
<main class="login">
    <aside class="login__aside">
        <img src="../assets/mockup3.png" alt="" class="aside__mockup"/>
    </aside>

    <section class="login__content">
        <div class="content__title-group">
            <h1 class="content__title">Meow</h1>
            <h1 class="content__title">World</h1>
        </div>

        <Form @submit="handleLogin"  :validation-schema="schema" class="content__form">
            <h1 class="form__title">Iniciar sesión</h1>

            <Field name="email" class="form__input" placeholder="Email"/>
            <ErrorMessage name="email" class="form__error"/>

            <Field name="password" type="password" class="form__input" placeholder="Contraseña"/>
            <ErrorMessage name="password" class="form__error"/>

            <button type="submit" class="button__primary">Acceder</button>

            <ul>
                <li v-for="error in errors" class="form__error">{{ error }}</li>
            </ul>

            <p class="form__link">
                ¿No tienes cuenta? <a href="/register" class="link">Regístrate aquí</a>
            </p>
        </Form>
    </section>
</main>
</template>

<script>
import axios from 'axios';
import * as yup from 'yup';
import {Form, Field, ErrorMessage} from "vee-validate";
import {useUserStore} from "../stores/userStore.js";
import {useAuthStore} from "../stores/authStore.js";
import {mapState} from "pinia";

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },

    data() {
        return {
            errors: [],
            schema: yup.object().shape({
                email: yup
                    .string()
                    .trim()
                    .required('Ingrese el email')
                    .email('El formato del email no es válido')
                    .matches(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm, 'El formato del email no es válido'),
                password: yup
                    .string()
                    .trim()
                    .required("Ingrese la contraseña")
            })
        };
    },

    computed: {
        ...mapState(useUserStore, ["user"]),
        ...mapState(useAuthStore, ["token"]),
    },

    methods: {
        async handleLogin(values) {
            try {
                const response = await axios.post( import.meta.env.VITE_BASE_API + "auth/login", values);

                if (response.data.access_token) {
                    localStorage.setItem('token', response.data.access_token);
                    // useAuthStore().setToken(response.data.access_token);
                    useUserStore().setUser(response.data.data);

                    this.$router.push('/home');
                }
            } catch (error) {
                this.errors = [];

                if (error.response.status === 422) {
                    if ('email' in error.response.data.errors) {
                        this.errors = [...this.errors, ...error.response.data.errors.email];
                    }

                    if ('password' in error.response.data.errors) {
                        this.errors = [...this.errors, ...error.response.data.errors.password];
                    }
                } else {
                    this.errors = [...this.errors, ...error.response.data.errors];
                }
            }
        },
    },
};
</script>

<style scoped lang="scss">
main {
    padding: 1rem;
    height: 95vh;

    color: var(--text-color);

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4rem;
}

main::before {
    content: "";
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    background-image: url('../assets/wallpaper-400.png');
    background-repeat: repeat;
    opacity: 0.3;
    z-index: -1;
}

.aside__mockup {
    height: 44rem;
    filter: drop-shadow(-0.15rem 0.4rem 0.4rem rgba(0, 0, 0, 0.5));
}

@media (max-width: 870px) {
    main {
        gap: 0;
    }
    .aside__mockup {
        display: none;
    }
}

.login__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 3rem;

    height: 90vh;
}

.content__title-group {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.content__title {
    font-family: "DynaPuff", system-ui;
    line-height: 5rem;
    font-weight: normal;
    font-style: normal;
    font-size: 6rem;
    text-align: center;

    color: var(--header-color);
    background-color: var(--background-color);
    width: fit-content;
    border-radius: 2rem;
    padding: 0.5rem 1rem;
}

.form__title {
    font-family: "DynaPuff", system-ui;
    line-height: 5rem;
    font-weight: normal;
    font-style: normal;
    text-align: center;
}
</style>
