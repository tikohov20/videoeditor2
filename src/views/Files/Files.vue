<script setup lang="ts">
import File from "./File.vue";
import { useFilesStore } from "../../store/filesStore.ts";
import { storeToRefs } from "pinia";

const emit = defineEmits(['addFileToCanvas'])
const filesStore = useFilesStore();
const { files } = storeToRefs(filesStore);

</script>

<template>
  <div class="files">
    <File @double-click="() => emit('addFileToCanvas', file)" v-for="file in files" :file="file"/>
  </div>
</template>

<style lang="scss" scoped>
.files {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>