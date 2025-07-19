<template>
  <Button type="button" label="No" icon="pi pi-times" @click="closeDialog({ buttonType: 'No' })" text></Button>
  <Button type="button" label="Yes" icon="pi pi-check" @click="closeDialog({ buttonType: 'Yes' })"></Button>
</template>

<script setup>
import { inject } from "vue";

const dialogRef = inject("dialogRef");

const closeDialog = (e) => {
  dialogRef.value.close(e);
};
</script>