<template>
  <div class="layer-action-transform">
    <div class="layer-action-transform-actions">
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
      <div>
        <label>Rotation</label>
        <input type="text" />
      </div>
      <div></div>
      <div>
        <label>Opacity</label>
        <input type="text" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layer-action-transform-actions {
  display: grid;
  grid-template-columns: repeat(2, auto);
  //row-gap: 1rem;
  //column-gap: 1.5rem;

  > div {
    width: 100%;
    height: $timelineLayerHeight;
    label {
      line-height: 1.1rem;
      font-size: 0.75rem;
      display: block;
    }

    input {
      //margin-top: .25rem;
    }
  }
}
</style>
<script setup lang="ts">
</script>