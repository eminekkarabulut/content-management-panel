<template>
  <table class="table table-hover">
    <thead>
      <tr>
        <th>Sayfa Adı</th>
        <th>Gösterim Adı</th>
        <th>Header Gösterim</th>
        <th>Footer Gösterim</th>
        <th class="text-center">İşlemler</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(page, index) in pages" :key="page.id">
        <td>
          <input type="text" class="form-control" v-model="page.pageName" />
        </td>
        <td>
          <input type="text" class="form-control" v-model="page.pageDisplayName" />
        </td>
        <td>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="checkbox" v-model="page.headerShow" />
          </div>
        </td>
        <td>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="checkbox" v-model="page.footerShow" />
          </div>
        </td>
        <td class="text-center">
          <button @click="UpdatePage(page)" class="btn btn-success text-light me-3">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button @click="DeletePage(page)" class="btn btn-danger text-light me-3">
            <i class="bi bi-trash"></i>
          </button>
          <button @click="ChangeOrder(page, index, true)" class="btn btn-primary text-light me-3">
            <i class="bi bi-arrow-up"></i>
          </button>
          <button @click="ChangeOrder(page, index, false)" class="btn btn-warning text-light me-3">
            <i class="bi bi-arrow-down"></i>
          </button>
          <button @click="GoContents(page)" class="btn btn-info text-light">
            <i class="bi bi-three-dots"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
import { ref, inject, defineProps } from "vue";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { useRouter } from "vue-router";

const db = useFirestore();
const router = useRouter();

const Notify = inject("Notify");
const GetPages = inject("GetPages");

const props = defineProps({
  pages: Array,
});

const UpdatePage = async (page) => {
  await setDoc(doc(db, "pages", page.id), {
    pageId: page.pageId,
    pageName: page.pageName,
    pageDisplayName: page.pageDisplayName,
    headerShow: page.headerShow,
    footerShow: page.footerShow,
    routeLink: page.routeLink,
    pageOrder: page.pageOrder,
  }).then(() => {
    Notify("Sayfa Başarıyla Güncellendi.", "bg-success");
    GetPages();
  });
};

const DeletePage = async (page) => {
  await deleteDoc(doc(db, "pages", page.id)).then(() => {
    Notify("Sayfa Başarıyla Silindi.", "bg-success");
    GetPages();
  });
};

const ChangeOrder = async (page, index, isDecrease) => {
  const otherPage = ref();
  otherPage.value = isDecrease ? props.pages[index - 1] : props.pages[index + 1];

  if (otherPage.value != null) {
    await setDoc(doc(db, "pages", page.id), {
      pageId: page.pageId,
      pageName: page.pageName,
      pageDisplayName: page.pageDisplayName,
      headerShow: page.headerShow,
      footerShow: page.footerShow,
      routeLink: page.routeLink,
      pageOrder: otherPage.value.pageOrder,
    });

    await setDoc(doc(db, "pages", otherPage.value.id), {
      pageId: otherPage.value.pageId,
      pageName: otherPage.value.pageName,
      pageDisplayName: otherPage.value.pageDisplayName,
      headerShow: otherPage.value.headerShow,
      footerShow: otherPage.value.footerShow,
      routeLink: otherPage.value.routeLink,
      pageOrder: page.pageOrder,
    }).then(() => {
      Notify("Sayfa Sırası Başarıyla Değiştirildi.", "bg-success");
      GetPages();
    });
  } else {
    Notify("Sayfa Sırası Değiştirilemez!", "bg-danger");
  }
};

const GoContents = async (page) => {
  router.push({
    name: "Contents",
    params: {
      pageId: page.id,
    },
  });
};
</script>
