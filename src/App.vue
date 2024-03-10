<template>
  <div class="container-fluid bg-light h-100">
    <div class="row h-100">
      <div class="col-md-3 bg-dark p-0">
        <SideBar />
      </div>
      <div class="col-md-9 my-3">
        <Navbar />
        <router-view class="bg-white rounded p-5"></router-view>
      </div>
    </div>
  </div>
  <teleport to="body">
    <Notification v-if="showNotification" :message="notificationMessage" :class="notificationClass" />
  </teleport>
</template>

<script setup>
import { ref, provide } from "vue";
import SideBar from "/src/components/SideBar.vue";
import Navbar from "/src/components/Navbar.vue";
import Notification from "/src/components/Notification.vue";

const showNotification = ref(false);
const notificationMessage = ref();
const notificationClass = ref();

const Notify = (message, color) => {
  notificationMessage.value = message;
  notificationClass.value = color;
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

provide("Notify", Notify);
</script>
