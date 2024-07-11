<script setup lang="ts">
import { ParsedFile } from "../../store/filesStore.ts";

interface Props {
  file: ParsedFile
}

const props = defineProps<Props>();

const emit = defineEmits(['doubleClick'])
</script>

<template>
  <div @dblclick="() => emit('doubleClick')" class="file">
    <figure class="file-preview-figure">
      <div class="file-info">
        <span>{{props.file.name}}</span>
        <small>{{props.file.duration && props.file.duration / 1000}} sec</small>
      </div>
      <img :src="props.file.preview" onerror="this.src = '/src/assets/placeholder.png'" alt="Preview"/>
    </figure>
  </div>
</template>

<style lang="scss" scoped>
.file {
  cursor: pointer;
  flex: 1 0 50%;
  max-width: 50%;
  flex-shrink: 0;
  padding: .2rem;
  border: 1px solid transparent;
  &:hover {
    .file-preview-figure {
      border: 1px solid #266dcd;
    }
  }
}
.file-preview-figure {
  border: 1px solid transparent;
  margin: 0 auto;
  padding-top: 55%;
  position: relative;
  background: rgb(47 47 47);
  user-select: none;
  -webkit-user-select: none;
  transition: border 0.2s;
  .file-info {
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    top: 0;
    left: 0;
    right: 0;
    backdrop-filter: blur(10px);
    z-index: 1;
    padding: .25rem;
    opacity: 0;
    transition: opacity 0.2s;
    > span, small{
      text-shadow: 2px 1px 2px #212121;
    }
  }
  &:hover {
    .file-info {
      opacity: 1;
    }
  }
  img {
    position: absolute;
    pointer-events: none;
    left: 50%;
    top: 0;
    transform: translate(-50%);
    height: 100%;
    user-select: none;
    -webkit-user-select: none;
    max-width: 100%;
    object-fit: cover;
  }
}
</style>