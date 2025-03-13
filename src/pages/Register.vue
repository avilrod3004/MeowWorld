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

            <Form @submit="handleRegister" :validation-schema="schema" class="content__form">
                <h1 class="form__title">Crear cuenta</h1>

                <Field name="name" class="form__input" placeholder="Nombre"/>
                <ErrorMessage name="name" class="form__error"/>

                <Field name="username" class="form__input" placeholder="Nombre de usuario"/>
                <ErrorMessage name="username" class="form__error"/>

                <Field name="email" class="form__input" placeholder="Email"/>
                <ErrorMessage name="email" class="form__error"/>

                <Field name="password" type="password" class="form__input" placeholder="Contraseña"/>
                <ErrorMessage name="password" class="form__error"/>

                <Field name="password_confirmation" type="password" class="form__input" placeholder="Repita la contraseña"/>
                <ErrorMessage name="password_confirmation" class="form__error"/>

                <button type="submit" class="button__primary">Acceder</button>

                <ul>
                    <li v-for="error in errors" class="form__error">{{ error }}</li>
                </ul>

                <p class="form__link">
                    ¿Ya tienes una cuenta? <a href="/" class="link">Inicia sesión</a>
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
                name: yup
                    .string()
                    .trim()
                    .required("Ingrese un nombre")
                    .min(3, "Ingrese un nombre con más de 3 caracteres"),
                username: yup
                    .string()
                    .trim()
                    .required("Ingrese un nombre de usuario")
                    .min(3, "Ingrese un nombre de usuario con más de 3 caracteres"),
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
                    .matches(
                        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                        "La contraseña no cumple los requisitos. Debe tener una longitud mínima de 8 caracteres y contener una letra en mayúscula, un número y un caracter especial."
                    ),
                password_confirmation: yup
                    .string()
                    .trim()
                    .oneOf([yup.ref("password"), null], "Las contraseñas deben coincidir")
                    .required("Por favor, repita la contraseña")
            })
        };
    },

    computed: {
        ...mapState(useUserStore, ["user"]),
    },

    methods: {
        async handleRegister(values) {
            try {
                const response = await axios.post( import.meta.env.VITE_BASE_API + "auth/register", values);

                if (response.data.access_token) {
                    localStorage.setItem('token', response.data.access_token);
                    useUserStore().setUser(response.data.data);

                    this.$router.push('/home');
                }
            } catch (error) {
                this.errors = [];

                if (error.response.status === 422) {
                    if ('name' in error.response.data.errors) {
                        this.errors = [...this.errors, ...error.response.data.errors.name];
                    }

                    if ('username' in error.response.data.errors) {
                        this.errors = [...this.errors, ...error.response.data.errors.username];
                    }

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
        }
    }
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

    color: var(--primary-500);
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
