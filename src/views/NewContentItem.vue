<template>
  <div class="container">
    <div class="row">
      <h3 class="text-center">İçerik Bileşeni Ekle</h3>
      <hr class="w-75 m-auto my-3" />
      <div class="form-group row">
        <div class="form-group col-md-6">
          <label for="itemName">İçerik Bileşen Adı</label>
          <input v-model="itemName" type="text" class="form-control" id="itemName" placeholder="İçerik Bileşen Adı" />
        </div>
      </div>
      <div class="form-group row">
        <div class="form-group col-md-6">
          <label for="itemTitle">İçerik Bileşen Başlığı</label>
          <input v-model="itemTitle" type="text" class="form-control" id="itemTitle" placeholder="İçerik Bileşen Başlığı" />
        </div>
        <div class="form-group col-md-6">
          <label for="itemDisplayTitle">İçerik Bileşen Görünüm Başlığı</label>
          <input v-model="itemDisplayTitle" type="text" class="form-control" id="itemDisplayTitle" placeholder="İçerik Bileşen Görünüm Başlığı" />
        </div>
      </div>
      <div class="form-group row my-5">
        <div class="form-group col-md-6">
          <label for="itemMedia">İçerik Bileşen Media</label>
          <div class="d-flex justify-content-start align-items-center position-relative">
            <img v-if="itemMedia" :src="itemMedia" alt="example placeholder" style="width: 125px" />
            <img v-else src="https://mdbootstrap.com/img/Photos/Others/placeholder.jpg" style="width: 125px" />
            <label class="btn btn-sm btn-secondary input-group-text position-absolute" for="inputFile" style="top: 0px; left: 93px">
              <i class="bi bi-pencil-square"></i>
            </label>
            <input type="file" class="form-control" id="inputFile" style="display: none" @change="FileUpload" />
          </div>
        </div>
      </div>
      <div class="form-group row my-5">
        <div class="form-group col-md-6">
          <label>İçerik Bileşen Metni</label>
          <Editor api-key="xl8mwy3syi9k3el5x5w0r1altbnm5533rpkjje9gnnssjuxt" v-model="itemText" :init="{ plugins: 'lists link image table code help wordcount' }" />
        </div>
        <div class="form-group col-md-6">
          <label>İçerik Bileşen Görünüm Metni</label>
          <Editor api-key="xl8mwy3syi9k3el5x5w0r1altbnm5533rpkjje9gnnssjuxt" v-model="itemDisplayText" :init="{ plugins: 'lists link image table code help wordcount' }" />
        </div>
      </div>
      <div class="form-group row mt-5">
        <button type="submit" @click="CreateContentItem" class="btn btn-sm btn-primary w-25 m-2 ms-auto">İçerik Bileşen Oluştur</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRoute } from "vue-router";

const route = useRoute();
const db = useFirestore();
const firebaseConfig = inject("firebaseConfig");

const Notify = inject("Notify");

const pageId = ref();
const contentId = ref();

const file = ref();

onMounted(() => {
  pageId.value = route.params.pageId;
  contentId.value = route.params.contentId;
});

const itemName = ref();
const itemTitle = ref();
const itemDisplayTitle = ref();
const itemMedia = ref();
const itemText = ref();
const itemDisplayText = ref();

const CreateContentItem = async () => {
  await addDoc(collection(db, `/pages/${pageId.value}/contents/${contentId.value}/items`), {
    itemName: itemName.value,
    itemTitle: itemTitle.value,
    itemDisplayTitle: itemDisplayTitle.value,
    itemMedia: itemMedia.value,
    itemText: itemText.value,
    itemDisplayText: itemDisplayText.value,
  }).then(() => {
    Notify("İçerik Bileşeni Başarıyla Oluşturuldu.", "bg-success");
  });
};

const FileUpload = async (event) => {
  file.value = event.target.files[0];
  if (file.value) {
    await uploadImageToStorage(file.value).then((storageReference) => {
      setDownloadurl(storageReference);
    });
  }
};

const uploadImageToStorage = async (file) => {
  const storage = getStorage(firebaseConfig);
  const storageReference = storageRef(storage, "images/" + file.name);
  await uploadBytes(storageReference, file);
  return storageReference;
};

const setDownloadurl = async (storageReference) => {
  const downloadURL = await getDownloadURL(storageReference);
  itemMedia.value = downloadURL;
};
</script>
