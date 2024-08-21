<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { ref } from "vue";

interface Props {
  expanded: boolean
  iconLeft?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  expanded: false,
  iconLeft: false,
})

const emit = defineEmits(['update:expanded']);

const isExpanded = ref(false);
isExpanded.value = props.expanded;

const expand = () => {
  isExpanded.value = !isExpanded.value;
  emit('update:expanded', isExpanded.value);
}

defineExpose({
  isExpanded,

  expand
})
</script>

<template>
  <div class="accordion" :class="{expanded: isExpanded, 'icon-left': props.iconLeft}">
    <div class="accordion-heading">
      <div class="accordion-heading-content">
        <slot />
      </div>
      <div class="accordion-icons-container">
        <slot name="icons">
          <a class="accordion-heading-icon" @click="expand">
            <FontAwesomeIcon :icon="faAngleRight" />
          </a>
        </slot>
      </div>
    </div>
    <div class="accordion-content">
      <slot name="content" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$headingMargin: 1rem;

.accordion {
  padding: 0;
  text-align: left;
  .accordion-heading {
    display: flex;  text-align: left;

    align-items: center;
    justify-content: space-between;

    .accordion-icons-container {
      @include flex-center;
    }
    .accordion-heading-content {
      flex-grow: 1;
      //margin-right: $headingMargin
    }
    .accordion-heading-icon {
      @include transition;
      @include icon-container(1rem);
      margin-right: .5rem;
      color: $color-primary-dark;
    }
  }
  &.icon-left {
    .accordion-heading {
      flex-direction: row-reverse;

      .accordion-heading-content {
        //margin-right: 0;
        //margin-left: $headingMargin;
      }
    }
  }
  &.expanded {
    > .accordion-heading {
      .accordion-heading-icon {
        transform: rotate(90deg);
      }
    }

    > .accordion-content {
      max-height: 100vh;
      overflow: initial;
      margin-left: 1.5rem;
      //@include transition;
    }
  }
  > .accordion-content {
    //@include transition;
    max-height: 0;
    overflow: hidden;
  }
}
</style>