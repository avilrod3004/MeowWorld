<template>
<main class="login">
    <aside class="login__aside">
        <img src="" alt="" />
    </aside>

    <section class="login__content">
        <div class="content__title-group">
            <h1 class="content__title">Meow</h1>
            <h1 class="content__title">World</h1>
        </div>

        <form @submit.prevent="handleLogin" class="content__form">
            <h1 class="form__title">Iniciar sesión</h1>

            <input
                v-model="email"
                @blur="validateEmail"
                type="text" id="email"
                class="form__input"
                placeholder="Email"
                required
            />
            <ul v-if="errors.email.length > 0">
                <li
                    v-for="error in errors.email"
                    :key="error"
                    class="form__error"
                >
                    x {{ error }}
                </li>
            </ul>
<!--            <input-->
<!--                v-model="email"-->
<!--                @blur="v$.email.$touch"-->
<!--                type="text"-->
<!--                id="email"-->
<!--                class="form__input"-->
<!--                placeholder="Email"-->
<!--            />-->
<!--            <ul v-if="v$.email.$errors.length > 0">-->
<!--                <li v-for="error in v$.email.$errors" :key="error.$uid" class="form__error">-->
<!--                    x {{ error.$message }}-->
<!--                </li>-->
<!--            </ul>-->

            <input
                v-model="password"
                @blur="validatePassword"
                type="password"
                id="password"
                class="form__input"
                placeholder="Contraseña"
            />
            <ul v-if="errors.password.length > 0">
                <li
                    v-for="error in errors.password"
                    :key="error"
                    class="form__error"
                >
                    x {{ error }}
                </li>
            </ul>
<!--            <input-->
<!--                v-model="password"-->
<!--                @blur="v$.password.$touch"-->
<!--                type="password"-->
<!--                id="password"-->
<!--                class="form__input"-->
<!--                placeholder="Contraseña"-->
<!--            />-->
<!--            <ul v-if="v$.password.$errors.length > 0">-->
<!--                <li v-for="error in v$.password.$errors" :key="error.$uid" class="form__error">-->
<!--                    x {{ error.$message }}-->
<!--                </li>-->
<!--            </ul>-->

            <button type="submit" class="button__primary" :disabled="haveErrors">Acceder</button>
<!--            <button type="submit" class="button__primary" :disabled="v$.$invalid">-->
<!--                Acceder-->
<!--            </button>-->

            <ul v-if="errors.fromServer.length > 0">
                <li
                    v-for="error in errors.fromServer"
                    :key="error"
                    class="form__error"
                >
                    x {{ error }}
                </li>
            </ul>

            <p class="form__link">
                ¿No tienes cuenta? <a href="/register" class="link">Regístrate aquí</a>
            </p>
        </form>
    </section>
</main>
</template>

<script>
import axios from 'axios';
import * as yup from 'yup';

export default {
    data() {
        return {
            email: '',
            password: '',
            errors: {
                email: [],
                password: [],
                fromServer: []
            },
        };

        // return {
        //     email: '',
        //     password: '',
        //     errors: {
        //         fromServer: [],
        //     },
        // };
    },

    validations() {
        return {
            email: yup
                .string()
                .required('El email es obligatorio')
                .email('El formato del email no es válido'),

            password: yup
                .string()
                .required('La contraseña es obligatoria')
                .min(6, 'La contraseña debe tener al menos 6 caracteres'),
        };
    },

    methods: {
        async handleLogin() {
            // if (this.haveErrors()) return;
            // const isValid = await this.v$.$validate();
            // if (!isValid) return;

            try {
                const response = await axios.post( import.meta.env.VITE_BASE_API + "auth/login", {
                    email: this.email,
                    password: this.password
                });

                if (response.data.access_token) {
                    localStorage.setItem('token', response.data.access_token);
                    this.$router.push('/profile');
                }
            } catch (error) {
                // this.errors = {
                //     email: [],
                //     password: [],
                //     others: []
                // }

                this.errors.fromServer = error.response.data.errors || ['Error en la autenticación'];

                // if (error.response.status === 422) {
                //     if ('email' in error.response.data.errors) {
                //         this.errors.email = error.response.data.errors.email;
                //     }
                //
                //     if ('password' in error.response.data.errors) {
                //         this.errors.password = error.response.data.errors.password;
                //     }
                // } else {
                //     this.errors.fromServer = error.response.data.errors;
                // }
            }
        },

        validateEmail() {
            this.errors.email = [];
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!this.email) {
                this.errors.email.push('El email es obligatorio.');
            } else if (!emailPattern.test(this.email)) {
                this.errors.email.push('El formato del email no es válido.');
            }
        },

        validatePassword() {
            this.errors.password = [];

            if (!this.password) {
                this.errors.password.push("La contraseña es obligatoria.");
            }
        },
    },

    computed: {
        haveErrors() {
            return this.errors.email.length > 0 || this.errors.password.length > 0;
        }
    },

    // watch: {
    //     email: 'validateEmail',
    //     password: 'validatePassword',
    // }
};
</script>

<style scoped lang="scss">
main {
    padding: 1rem;
    height: 95vh;

    color: var(--text-color);
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

.content__form {
    background-color: var(--background-color);
    border-radius: 1rem;
    box-shadow: 0 0.25rem 0.5rem 0 rgba(0, 0, 0, 0.25);

    display: flex;
    flex-direction: column;
    gap: 1rem;

    padding: 2rem;
}

.form__title {
    font-family: "DynaPuff", system-ui;
    line-height: 5rem;
    font-weight: normal;
    font-style: normal;
    text-align: center;
}
</style>
