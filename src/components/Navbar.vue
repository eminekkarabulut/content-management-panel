<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">{{ currentRoute }}</a>
    </div>
    <button type="button" @click="LogOut" class="btn btn-outline-primary ms-auto" title="Çıkış Yap"><i class="bi bi-box-arrow-right text-primary"></i> {{ currentUserName }}</button>
  </nav>
</template>

<script setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed } from "@vue/reactivity";

const router = useRouter();
const store = useStore();

const currentRoute = computed(() => router.currentRoute.value.name);
const currentUserName = computed(() => store.getters.GetCurrentUserName);

const LogOut = () => {
  store.commit("LogoutUser");
  router.push({
    name: "LogIn",
  });
};
</script>
