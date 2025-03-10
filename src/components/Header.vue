<template>
<header class="header">
    <h1 class="header__nombre">MeowWorld</h1>
    <font-awesome-icon icon="gear" class="icono icono-header"/>
</header>

</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGear } from "@fortawesome/free-solid-svg-icons";

library.add(faGear);

export default {
    name: "Header",
    components: { FontAwesomeIcon }
}
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 1rem;
    border-bottom: 1px solid black;
}

.header__nombre {
    color: var(--header-color);
}

.header__nombre {
    font-family: "DynaPuff", system-ui;
    font-weight: normal;
    font-style: normal;
    font-size: 2.5rem;
}

.icono-header {
    font-size: 1.75rem;
}
</style>