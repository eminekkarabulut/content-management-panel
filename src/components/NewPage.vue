<template>
  <div class="row g-3 align-items-center justify-content-center">
    <div class="col-auto">
      <label for="pageName" class="col-form-label">Sayfa Adı</label>
    </div>
    <div class="col-auto">
      <input type="text" id="pageName" class="form-control" v-model="pageName" placeholder="Sayfa Adı" />
    </div>
    <div class="col-auto">
      <label for="pageDisplayName" class="col-form-label">Sayfa Gösterim Adı</label>
    </div>
    <div class="col-auto">
      <input type="text" id="pageDisplayName" class="form-control" v-model="pageDisplayName" placeholder="Sayfa Gösterim Adı" />
    </div>
    <div class="col-auto">
      <label for="routeLink" class="col-form-label">Route Link</label>
    </div>
    <div class="col-auto">
      <input type="text" id="routeLink" class="form-control" v-model="routeLink" placeholder="Route Link" />
    </div>
    <div class="col-auto">
      <label for="headerShow" class="col-form-label">Header Gösterim</label>
    </div>
    <div class="col-auto">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" id="headerShow" v-model="headerShow" />
      </div>
    </div>
    <div class="col-auto">
      <label for="footerShow" class="col-form-label">Footer Gösterim</label>
    </div>
    <div class="col-auto">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" id="footerShow" v-model="footerShow" />
      </div>
    </div>
    <div class="col-auto">
      <button class="btn btn-primary" @click="CreatePage">Yeni Sayfa Oluştur</button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";

const db = useFirestore();

const Notify = inject("Notify");
const GetPages = inject("GetPages");

const pageName = ref();
const pageDisplayName = ref();
const routeLink = ref();
const headerShow = ref(true);
const footerShow = ref(true);

const CreatePage = async () => {
  await addDoc(collection(db, "pages"), {
    pageName: pageName.value,
    pageDisplayName: pageDisplayName.value,
    routeLink: routeLink.value,
    headerShow: headerShow.value,
    footerShow: footerShow.value,
    pageOrder: Math.floor(1000 + Math.random() * 9000),
  }).then(() => {
    Notify("Sayfa Başarıyla Oluşturuldu.", "bg-success");
    GetPages();
  });
};
</script>
