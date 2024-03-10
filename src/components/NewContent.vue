<template>
  <div class="form-group row">
    <div class="form-group col-md-6">
      <label for="contentName">İçerik Adı</label>
      <input v-model="contentName" type="text" class="form-control" id="contentName" placeholder="İçerik Adı" />
    </div>
    <div class="form-group col-md-6">
      <label for="contentHeader">İçerik Başlığı</label>
      <input v-model="contentHeader" type="text" class="form-control" id="contentHeader" placeholder="İçerik Başlığı" />
    </div>
  </div>
  <div class="form-group row my-5">
    <div class="form-group col-md-6">
      <label for="contentMedia">İçerik Media</label>
      <div class="d-flex justify-content-start align-items-center position-relative">
        <img v-if="contentMedia" :src="contentMedia" alt="example placeholder" style="width: 125px" />
        <img v-else src="https://mdbootstrap.com/img/Photos/Others/placeholder.jpg" style="width: 125px" />
        <label class="btn btn-sm btn-secondary input-group-text position-absolute" for="inputFile" style="top: 0px; left: 93px">
          <i class="bi bi-pencil-square"></i>
        </label>
        <input type="file" class="form-control" id="inputFile" style="display: none" @change="FileUpload" />
      </div>
    </div>
    <div class="form-group col-md-6">
      <label>İçerik Metni</label>
      <Editor api-key="xl8mwy3syi9k3el5x5w0r1altbnm5533rpkjje9gnnssjuxt" v-model="contentText" :init="{ plugins: 'lists link image table code help wordcount' }" />
    </div>
  </div>
  <div class="form-group row mt-5">
    <button type="submit" @click="CreateContent" class="btn btn-sm btn-primary w-25 m-2 ms-auto">İçerik Oluştur</button>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const db = useFirestore();
const firebaseConfig = inject("firebaseConfig");

const Notify = inject("Notify");
const GetContents = inject("GetContents");

const file = ref();

const contentName = ref();
const contentHeader = ref();
const contentMedia = ref();
const contentText = ref();

const CreateContent = async () => {
  const time = new Date().getTime();
  await addDoc(collection(db, "contents"), {
    id: time,
    name: contentName.value,
    header: contentHeader.value,
    media: contentMedia.value,
    contentText: contentText.value,
  }).then(() => {
    Notify("İçerik Başarıyla Oluşturuldu.", "bg-success");
    GetContents();
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
  contentMedia.value = downloadURL;
};
</script>
