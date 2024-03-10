<template>
  <!-- <ul class="list-group list-group-flush">
    <li class="list-group-item"></li>
  </ul> -->

  <div class="container">
    <div class="row">
      <!-- <NewPage /> -->
      <!-- <hr class="w-75 m-auto my-5" /> -->
      <PageList :pages="pages" />
    </div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from "vue";
import { useFirestore } from "vuefire";
import { collection, getDocs } from "firebase/firestore";
import PageList from "/src/components/PageList.vue";
// import NewPage from "/src/components/NewPage.vue";

const db = useFirestore();
const pages = ref([]);

onMounted(() => {
  GetPages();
});

const GetPages = async () => {
  await getDocs(collection(db, "pages")).then((response) => {
    pages.value = [];
    response.forEach((doc) => {
      const page = doc.data();
      page.id = doc.id;
      pages.value.push(page);
    });

    pages.value = pages.value.sort((a, b) => {
      return a.pageOrder - b.pageOrder;
    });
  });
};

provide("GetPages", GetPages);
</script>
