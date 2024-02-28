<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  end: {
    type: Number,
    required: true
  },
  mapper: {
    type: Function,
    default: (val:number) => {
      if(val < 10) return `0${val}:00`;
      return `${val}:00`
    }
  }
});

const markers = computed(() => {
  return Array(props.end).fill({}).map((_value, index, _array) => {
    return {
      id: index,
      text: props.mapper(index)
    }
  });
})
</script>

<template>
  <div class="markers">
    <div class="marker" v-for="marker in markers">
      <div class="marker-timestamp">
        <span>
          {{ marker.text }}
        </span>
      </div>
      <div class="marker-dividers">
        <span v-for="index in 10" class="marker-divider" :class="{ central: index === 1, middle: index === 6 }" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.markers {
  display: flex;

  .marker {
    width: 6.25rem;
    flex-shrink: 0;
  }

  .marker-timestamp {
    margin-bottom: .5rem;

    > span {
      transform: translateX(-50%);
      display: inline-block;
    }
  }

  .marker-dividers {
    display: flex;
    height: .75rem;
    align-items: baseline;
  }

  .marker-divider {
    border-left: 1px solid rgba(255, 255, 255, 0.62);
    width: calc(0.625rem);
    display: block;
    flex-shrink: 0;
    flex-grow: 0;
    height: .4rem;

    &.central {
      height: .75rem;
    }

    &.middle {
      height: .6rem;
    }
  }
}
</style>