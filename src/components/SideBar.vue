<template>
  <div class="card h-100 bg-dark">
    <h5 class="card-title text-center mt-3 text-white">Yönetim Paneli</h5>
    <hr class="w-75 text-light m-auto">
  <div class="card-body">
    <SideBarList />
  </div>
</div>

</template>

<script setup>
import SideBarList from "/src/components/SideBarList.vue";
</script>
