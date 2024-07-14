<script setup lang="ts">
import LayerAccordion from "@/views/Layers/LayerAccordion.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
interface Props {
  visible: boolean
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
      <div>
        <div>
          <label>Position X</label>
          <input type="text" />
        </div>
        <div>
          <label>Position Y</label>
          <input type="text" />
        </div>
        <div>
          <label>Width</label>
          <input type="text" />
        </div>
        <div>
          <label>Height</label>
          <input type="text" />
        </div>
      </div>
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