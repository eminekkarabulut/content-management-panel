<template>
  <div class="card my-5 px-0">
    <div class="card-header">
      <div class="form-group row mt-3">
        <div class="form-group col-md-6">
          <label for="contentName">İçerik Adı</label>
          <input v-model="content.contentName" type="text" class="form-control" id="contentName" placeholder="İçerik Adı" />
        </div>
        <div class="form-group col-md-6">
          <label for="contentMedia">İçerik Media</label>
          <div class="d-flex justify-content-start align-items-center position-relative">
            <img v-if="content.contentMedia" :src="content.contentMedia" alt="example placeholder" style="width: 125px" />
            <img v-else src="https://mdbootstrap.com/img/Photos/Others/placeholder.jpg" style="width: 125px" />
            <label class="btn btn-sm btn-secondary input-group-text position-absolute" for="inputFile" style="top: 0px; left: 93px">
              <i class="bi bi-pencil-square"></i>
            </label>
            <input type="file" class="form-control" id="inputFile" style="display: none" @change="FileUpload" />
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="form-group row my-5 mb-5">
        <div class="form-group col-md-6">
          <label for="contentTitle">İçerik Başlığı</label>
          <input v-model="content.contentTitle" type="text" class="form-control" id="contentTitle" placeholder="İçerik Başlığı" />
        </div>
        <div class="form-group col-md-6">
          <label for="contentDisplayTitle">İçerik Görünüm Başlığı</label>
          <input v-model="content.contentDisplayTitle" type="text" class="form-control" id="contentDisplayTitle" placeholder="İçerik Başlığı" />
        </div>
      </div>

      <div class="form-group row my-5">
        <div class="form-group col-md-6">
          <label for="contentText">İçerik Metni</label>
          <Editor api-key="xl8mwy3syi9k3el5x5w0r1altbnm5533rpkjje9gnnssjuxt" v-model="content.contentText" :init="{ plugins: 'lists link image table code help wordcount' }" />
        </div>
        <div class="form-group col-md-6">
          <label for="contentDisplayText">İçerik Görünüm Metni</label>
          <Editor api-key="xl8mwy3syi9k3el5x5w0r1altbnm5533rpkjje9gnnssjuxt" v-model="content.contentDisplayText" :init="{ plugins: 'lists link image table code help wordcount' }" />
        </div>
      </div>
      <div class="form-group row" style="margin-top: 125px">
        <button type="submit" @click="UpdateContent" class="btn btn-sm btn-primary w-25 m-2 ms-auto">Güncelle</button>
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
const GetContent = inject("GetContent");

const file = ref();

const props = defineProps({
  content: Object,
});

onMounted(() => {
  props.content.contentText = props.content?.contentText?.replace(/\s{2,}/g, "");
  props.content.contentDisplayText = props.content?.contentDisplayText?.replace(/\s{2,}/g, "");
});

const UpdateContent = async () => {
  await setDoc(doc(db, "pages", route.params.pageId, "contents", props.content.id), {
    contentName: props.content.contentName,
    contentMedia: props.content.contentMedia,
    contentTitle: props.content.contentTitle,
    contentDisplayTitle: props.content.contentDisplayTitle,
    contentText: props.content.contentText,
    contentDisplayText: props.content.contentDisplayText,
    componentName: props.content.componentName,
    contentOrder: props.content.contentOrder,
  }).then((resp) => {
    Notify("İçerik Başarıyla Güncellendi.", "bg-success");
    GetContent();
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
  props.content.contentMedia = downloadURL;
  Notify("Resim Başarıyla Eklendi.", "bg-success");
};
</script>
