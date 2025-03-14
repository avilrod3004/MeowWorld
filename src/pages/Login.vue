
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

            <ErrorsList :errorsServer="errors"/>

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
import {mapState} from "pinia";
import ErrorsList from "../components/ErrorsList.vue";

/**
 * Componente de inicio de sesión de usuario.
 *
 * Este componente permite a los usuarios iniciar sesión en su cuenta mediante un formulario de registro que incluye validación
 * en el frontend. Además, gestiona los errores del servidor y muestra los mensajes de error al usuario.
 *
 * @component
 * @example
 * <Login />
 */
export default {
    components: {
        ErrorsList,
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
        /**
         * Estado del usuario obtenido del store.
         * @returns {Object|null} Datos del usuario o null si no hay sesión iniciada.
         */
        ...mapState(useUserStore, ["user"]),
    },

    methods: {
        /**
         * Maneja el envío del formulario de inicio de sesión.
         *
         * Envía los datos a la API para autenticar al usuario. Si es exitoso, guarda el token y redirige a la página de inicio.
         * En caso de error, captura los mensajes de validación o errores del servidor.
         *
         * @async
         * @function handleLogin
         * @param {Object} values - Datos del formulario con email y contraseña.
         */
        async handleLogin(values) {
            try {
                const response = await axios.post( import.meta.env.VITE_BASE_API + "auth/login", values);

                if (response.data.access_token) {
                    localStorage.setItem('token', response.data.access_token);
                    useUserStore().setUser(response.data.data);

                    this.$router.push('/home');
                }
            } catch (error) {
                this.errors = [];

                if (!error.response) {
                    this.errors = ["El servidor no se encuentra disponible. Vuelva a intentarlo en unos minutos."]
                    return
                }

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
    font-size: 7rem;
    text-align: center;

    color: var(--header-color);
    width: fit-content;
    border-radius: 2rem;
    padding: 0.5rem 1rem;
    text-shadow: 4px 10px var(--primary-100);
}

.form__title {
    font-family: "DynaPuff", system-ui;
    line-height: 5rem;
    font-weight: normal;
    font-style: normal;
    text-align: center;
}
</style>
