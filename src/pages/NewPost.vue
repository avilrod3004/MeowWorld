<template>
    <form @submit.prevent="submitPost" class="formulario">
        <h1 class="formulario__titulo">Nuevo post</h1>

        <div>
            <label for="imagen" class="formulario__label-image">
                <img :src="imagePreview" alt="Subir imagen" class="img__preview">
                <span class="label-image__text">Subir imagen</span>
            </label>
            <input
                type="file"
                id="imagen"
                name="imagen"
                accept="image/*"
                class="formulario__input-image"
                @change="handleImageUpload"
            >
        </div>

        <div class="formulario__label-input">
            <label for="descripcion">Añade una descripción:</label>
            <textarea
                v-model="description"
                id="descripcion"
                class="form__input form__textarea"
            >
            </textarea>
        </div>

        <div class="formulario__label-input">
            <label>¿Quién aparece en la foto?</label>

            <div v-for="(cat, index) in cats" :key="index" class="form__checkbox">
                <input
                    type="checkbox"
                    :id="'opcion' + index"
                    :value="cat"
                    v-model="selectedCats"
                >
                <label :for="'opcion' + index">{{ cat }}</label>
            </div>
        </div>

        <button type="submit" class="button__primary">Publicar</button>
    </form>
</template>

<script>
import placeholderImage from '../assets/gato_6.png';

export default {
    name: "NewPost",
    data() {
        return {
            imagePreview: placeholderImage, // Usa la imagen de placeholder directamente
            imageFile: null,
            description: "",
            selectedCats: [],
            cats: ["Misifú", "Pelusa", "Garfiel", "Bigotes"]
        };
    },
    methods: {
        handleImageUpload(event) {
            const file = event.target.files[0];

            if (file) {
                this.imageFile = file;

                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        submitPost() {
            if (!this.imageFile || !this.description) {
                alert("Por favor, sube una imagen y añade una descripción.");
                return;
            }

            const formData = new FormData();
            formData.append("imagen", this.imageFile);
            formData.append("descripcion", this.description);
            formData.append("gatos", JSON.stringify(this.selectedCats));

            console.log("Formulario enviado:", {
                imagen: this.imageFile.name,
                descripcion: this.description,
                gatos: this.selectedCats,
            });

            // Aquí podrías hacer la petición a la API
            // axios.post('/api/posts', formData)
        }
    }
};
</script>


<style scoped>
.formulario {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.formulario__titulo {
    font-family: "DynaPuff", system-ui;
    font-size: 2rem;
}

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

.formulario__label-input {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.img__preview {
    width: 12rem;
    height: 12rem;
    object-fit: contain;
    border-radius: 8px;
}
</style>
