<template>
  <div class="pane">
  <div v-if="$slots.left" class="left-pane">
    <slot name="left"/>
  </div>
  <div v-if="$slots.right"  class="right-pane">
    <slot name="right"/>
  </div>
  </div>
</template>

<script>
export default {
  name: "SplitPane"
}
</script>

<style scoped>
.pane{
  width: 100%;
  display: flex;
}
.left-pane{
  width: 70%;
}
.right-pane{
  width: 30%;
}
</style>
