<script setup lang="ts">
interface IProps  {
  allowedTypes: Array<string>,
  modelValue: Array<IFile>
}

const emits = defineEmits(['update:modelValue', 'upload']);
const props = defineProps<IProps>();

const uploadedFiles = props.modelValue;

function handleFile(e: Event) {
  const event = e as HtmlInputEvent;
  const files = event.target.files ?? [];

  if (files.length) {
    const file = files[0];
    if (!props.allowedTypes.includes(file.type)) {
      throw "File type not supported sad";
    }

    emits('update:modelValue', [...uploadedFiles, file]);
    emits('upload', file);
  }
}
</script>


<template>
  <input type="file" @change="handleFile">
</template>