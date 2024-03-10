<template>
  <div class="container">
    <div class="row">
      <h3 class="text-center">İçerik</h3>
      <hr class="w-75 m-auto my-3" />
      <ContentInfo v-if="content" :content="content" />
      <div class="row">
        <h3 class="text-center mt-5 d-inline">İçerik Bileşenleri</h3>
        <a @click="GoNewContentItem(content)" class="btn btn-secondary w-25 ms-auto">Yeni İçerik Bileşeni Ekle</a>
      </div>
      <hr class="w-75 m-auto my-3" />
      <ContentItem v-for="item in items" :item="item" />
    </div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from "vue";
import { useFirestore } from "vuefire";
import { collection, getDocs } from "firebase/firestore";
import { useRoute, useRouter } from "vue-router";

import ContentInfo from "/src/components/ContentInfo.vue";
import ContentItem from "/src/components/ContentItem.vue";

const db = useFirestore();
const route = useRoute();
const router = useRouter();

const contents = ref([]);
const items = ref([]);
const content = ref();

onMounted(() => {
  GetContent().then(() => {
    content.value = contents.value[0];
  });
  GetItems().then(() => {});
});

const GetContent = async () => {
  await getDocs(collection(db, "pages", route.params.pageId, "contents")).then((response) => {
    contents.value = [];
    response.forEach((doc) => {
      const cont = doc.data();
      cont.id = doc.id;
      contents.value.push(cont);
    });
  });
  contents.value = contents.value.filter((f) => f.id == route.params.contentId);
};

const GetItems = async () => {
  await getDocs(collection(db, "pages", route.params.pageId, "contents", route.params.contentId, "items")).then((response) => {
    items.value = [];
    response.forEach((doc) => {
      const item = doc.data();
      item.id = doc.id;
      items.value.push(item);
    });
  });

  items.value = items.value.sort((a, b) => {
    return a.itemOrder - b.itemOrder;
  });
};

const GoNewContentItem = async (content) => {
  router.push({
    name: "NewContentItem",
    params: {
      pageId: route.params.pageId,
      contentId: content.id,
    },
  });
};

provide("GetContent", GetContent);
provide("GetItems", GetItems);
</script>
