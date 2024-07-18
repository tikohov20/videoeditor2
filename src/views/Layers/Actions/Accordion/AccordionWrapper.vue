<script setup lang="ts">
import LayerAccordion from "@/views/Layers/Actions/Accordion/Accordion.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Keyframes from "@/views/Layers/Keyframes/Keyframes.vue";
import { CanvasItem } from "@/types.ts";
import Transform from "@/views/Layers/Actions/Transform/Transform.vue";
interface Props {
  visible: boolean
  layer: CanvasItem
}

const props = defineProps<Props>();
const emit = defineEmits(['update:visible', 'delete-layer']);
</script>

<template>
  <LayerAccordion :visible="props.visible" @update:visible="() => emit('update:visible', !props.visible)" v-bind="$attrs">
    <template #default>
      <div class="accordion-title-and-icon">
        <slot />
        <a class="accordion-title-icon" @click="emit('delete-layer')">
          <FontAwesomeIcon :icon="faTrashCan" />
        </a>
      </div>
    </template>

    <template #effects>
      -
    </template>

    <template #transform>
      <Transform />
    </template>
  </LayerAccordion>
</template>

<style lang="scss" scoped>
.accordion-title-and-icon {
  @include flex-container;

  .accordion-title-icon {
    @include icon-container(1rem);
    color: $color-primary-dark;
  }
}
</style>