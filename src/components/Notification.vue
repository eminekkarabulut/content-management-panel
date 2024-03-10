<template>
  <div class="notification" :class="class">
    {{ message }}
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  message: String,
  class: String,
});
</script>

<style scoped>
.notification {
  position: fixed;
  top: 5%;
  right: 0;
  transform: translateY(-50%);
  color: white;
  padding: 10px;
  border-radius: 5px;
}
</style>
