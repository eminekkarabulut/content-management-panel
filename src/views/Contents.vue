<template>
  <div class="container">
    <div class="row">
      <ContentList :contents="contents" />
    </div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from "vue";
import { useFirestore } from "vuefire";
import { collection, getDocs } from "firebase/firestore";
import { useRoute } from "vue-router";

import ContentList from "/src/components/ContentList.vue";

const db = useFirestore();
const route = useRoute();

const contents = ref([]);
const pageId = ref();

onMounted(() => {
  pageId.value = route.params.pageId;
  GetContents();
});

const GetContents = async () => {
  await getDocs(collection(db, `pages/${pageId.value}/contents`)).then(
    (response) => {
      contents.value = [];
      response.forEach((doc) => {
        const content = doc.data();
        content.id = doc.id;
        contents.value.push(content);
      });
    }
  );

  contents.value = contents.value.sort((a, b) => {
    return a.contentOrder - b.contentOrder;
  });
};

provide("GetContents", GetContents);
</script>
