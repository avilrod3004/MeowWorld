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

            <form @submit.prevent="handleRegister" class="content__form">
                <h1 class="form__title">Crear cuenta</h1>

                <input v-model="name" type="text" id="name" class="form__input" placeholder="Nombre" />
                <input v-model="username" type="text" id="username" class="form__input" placeholder="Nombre de usuario" required />
                <input v-model="email" type="text" id="email" class="form__input" placeholder="Email" required />
                <input v-model="password" type="password" id="password" class="form__input" placeholder="Contraseña" required />

                <button type="submit" class="button__primary">Acceder</button>

                <p class="form__link">
                    ¿Ya tienes una cuenta? <a href="/" class="link">Inicia sesión</a>
                </p>
            </form>
        </section>
    </main>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            name: '',
            username: '',
            email: '',
            password: '',
        };
    },

    methods: {
        async handleRegister() {
            try {
                const response = await axios.post( import.meta.env.VITE_BASE_API + "auth/register", {
                    name: this.name,
                    username: this.username,
                    email: this.email,
                    password: this.password
                });

                console.log('Respuesta de la API:', response.data);

                if (response.data.access_token) {
                    localStorage.setItem('token', response.data.access_token);
                    this.$router.push('/profile');
                }
            } catch (error) {
                console.error('Error al crear la cuenta:', error);
                alert('Credenciales incorrectas o error en el servidor');
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

    color: var(--primary-500);
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
