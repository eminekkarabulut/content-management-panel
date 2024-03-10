<template>
  <div class="card my-5 px-0">
    <div class="card-header">
      <div class="form-group row mt-3">
        <div class="form-group col-md-6">
          <label :for="`itemName${item.itemOrder}`">İçerik Bileşen Adı</label>
          <input v-model="item.itemName" type="text" class="form-control" :id="`itemName${item.itemOrder}`" placeholder="İçerik Bileşen Adı" />
        </div>
        <div class="form-group col-md-6">
          <label>İçerik Bileşen Media</label>
          <div class="d-flex justify-content-start align-items-center position-relative">
            <img v-if="item.itemMedia" :src="item.itemMedia" alt="" style="width: 125px" />
            <img v-else src="https://mdbootstrap.com/img/Photos/Others/placeholder.jpg" style="width: 125px" />
            <label class="btn btn-sm btn-secondary input-group-text position-absolute" :for="`itemInputFile${item.itemOrder}`" style="top: 0px; left: 93px">
              <i class="bi bi-pencil-square"></i>
            </label>
            <input type="file" class="form-control" :id="`itemInputFile${item.itemOrder}`" style="display: none" @change="ItemFileUpload($event, item)" />
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="form-group row my-5 mb-5">
        <div class="form-group col-md-6">
          <label :for="`itemTitle${item.itemOrder}`">İçerik Bileşen Başlığı</label>
          <input v-model="item.itemTitle" type="text" class="form-control" :id="`itemTitle${item.itemOrder}`" placeholder="İçerik Bileşen Başlığı" />
        </div>
        <div class="form-group col-md-6">
          <label :for="`itemDisplayTitle${item.itemOrder}`">İçerik Bileşen Görünüm Başlığı</label>
          <input v-model="item.itemDisplayTitle" type="text" class="form-control" :id="`itemDisplayTitle${item.itemOrder}`" placeholder="İçerik Bileşen Başlığı" />
        </div>
      </div>
      <div class="form-group row my-5">
        <div class="form-group col-md-6">
          <label :for="`itemText${item.itemOrder}`">İçerik Bileşen Metni</label>
          <Editor api-key="xl8mwy3syi9k3el5x5w0r1altbnm5533rpkjje9gnnssjuxt" v-model="item.itemText" :init="{ plugins: 'lists link image table code help wordcount' }" />
        </div>
        <div class="form-group col-md-6">
          <label :for="`itemDisplayText${item.itemOrder}`">İçerik Bileşen Görünüm Metni</label>
          <Editor api-key="xl8mwy3syi9k3el5x5w0r1altbnm5533rpkjje9gnnssjuxt" v-model="item.itemDisplayText" :init="{ plugins: 'lists link image table code help wordcount' }" />
        </div>
      </div>
      <div class="form-group row" style="margin-top: 125px">
        <button type="submit" @click="UpdateContentItem(item)" class="btn btn-sm btn-primary w-25 m-2 ms-auto">Güncelle</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, inject, onMounted } from "vue";
import { setDoc, doc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRoute } from "vue-router";

const db = useFirestore();
const firebaseConfig = inject("firebaseConfig");
const route = useRoute();

const Notify = inject("Notify");
const GetItems = inject("GetItems");

const itemfile = ref();

const props = defineProps({
  item: Object,
});

onMounted(() => {
  props.item.itemText = props.item?.itemText?.replace(/\s{2,}/g, "");
  props.item.itemDisplayText = props.item?.itemDisplayText?.replace(/\s{2,}/g, "");
});

const UpdateContentItem = async (item) => {
  await setDoc(doc(db, "pages", route.params.pageId, "contents", route.params.contentId, "items", item.id), {
    itemName: item.itemName || "",
    itemMedia: item.itemMedia || "",
    itemTitle: item.itemTitle || "",
    itemDisplayTitle: item.itemDisplayTitle || "",
    itemText: item.itemText || "",
    itemDisplayText: item.itemDisplayText || "",
    itemOrder: item.itemOrder || Math.floor(1000 + Math.random() * 9000),
  }).then(() => {
    Notify("İçerik Bileşen Bileşeni Başarıyla Güncellendi.", "bg-success");
    GetItems();
  });
};

const ItemFileUpload = async (event, selectItem) => {
  itemfile.value = event.target.files[0];
  if (itemfile.value) {
    await uploadImageToStorage(itemfile.value).then((storageReference) => {
      setDownloadurl(storageReference, selectItem);
    });
  }
};

const uploadImageToStorage = async (itemfile) => {
  const storage = getStorage(firebaseConfig);
  const storageReference = storageRef(storage, "images/" + itemfile.name);
  await uploadBytes(storageReference, itemfile);
  return storageReference;
};

const setDownloadurl = async (storageReference, selectItem) => {
  const downloadURL = await getDownloadURL(storageReference);
  selectItem.itemMedia = downloadURL;
  Notify("Resim Başarıyla Eklendi.", "bg-success");
};
</script>
