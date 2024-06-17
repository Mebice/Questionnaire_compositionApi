<script setup>
import { onMounted } from 'vue'


onMounted(() => {
    const storedData = sessionStorage.getItem('formData');
    const formData = JSON.parse(storedData);
    console.log(formData);
})
</script>
<template>
</templete>