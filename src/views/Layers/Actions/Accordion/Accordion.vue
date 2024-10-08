<script setup lang="ts">
import { onMounted, ref } from "vue";

import { faAngleRight, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import Accordion from "@/components/Accordion/Accordion.vue";

interface Props {
  visible: boolean
}

const props = defineProps<Props>();
const emit = defineEmits(['update:visible']);

const accordion = ref<typeof Accordion | null>(null);
const accordionExpanded = ref(false);

const secondExpanded = ref(false);
</script>

<template>
  <Accordion v-model:expanded="accordionExpanded" ref="accordion" v-bind="$attrs">
    <template #icons>
      <a class="accordion-heading-icon" @click="() => emit('update:visible', !props.visible)">
        <FontAwesomeIcon v-if="props.visible" :icon="faEyeSlash" />
        <FontAwesomeIcon v-else :icon="faEye" />
      </a>

      <a class="accordion-heading-icon trigger" @click="() => accordion?.expand()">
        <FontAwesomeIcon :icon="faAngleRight" />
      </a>
    </template>

    <slot />

    <template #content>
      <slot name="content">
        <div>
          <Accordion class="inner-accordion" v-model:expanded="secondExpanded">
            Effects

            <template #content>
              <slot name="effects" />
            </template>
          </Accordion>
          <Accordion class="inner-accordion" v-model:expanded="secondExpanded">
            Transform
            <template #content>
              <slot name="transform" />
            </template>
          </Accordion>
        </div>
      </slot>
    </template>
  </Accordion>
</template>

<style scoped lang="scss">
.accordion {
  padding: 0 1rem;
  :deep(.accordion-heading-icon) {
    @include transition;
    @include icon-container(1rem);
    margin-right: .5rem;
    color: $color-primary-dark;
  }
  :deep(.accordion-heading) {
    height: $timelineLayerHeight;
  }
  &.expanded {
    :deep(.accordion-heading-icon) {
      &.trigger {
        transform: rotate(90deg);
      }
    }
  }
}

.inner-accordion {
  padding: 0;
}
</style>