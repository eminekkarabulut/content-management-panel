<template>
  <table class="table table-hover">
    <thead>
      <tr>
        <th>İçerik Görseli</th>
        <th>İçerik Adı</th>
        <th>İçerik Başlığı</th>
        <th>İçerik Metni</th>
        <th class="text-center">İşlemler</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(content, index) in contents" :key="content.id">
        <td>
          <div class="d-flex justify-content-start align-items-center position-relative">
            <img v-if="content.contentMedia" :src="content.contentMedia" class="img-fluid" style="width: 125px" />
            <img v-else src="https://mdbootstrap.com/img/Photos/Others/placeholder.jpg" style="width: 125px" />
            <label class="btn btn-sm btn-secondary input-group-text position-absolute" :for="`contentInputFile${content.contentOrder}`" style="top: 0px; left: 93px">
              <i class="bi bi-pencil-square"></i>
            </label>
            <input type="file" class="form-control" :id="`contentInputFile${content.contentOrder}`" style="display: none" @change="FileUpload(content, $event)" />
          </div>
        </td>
        <td>{{ content.contentName }}</td>
        <td>{{ content.contentTitle }}</td>
        <td>{{ content.contentText }}</td>
        <td class="text-center">
          <button @click="GoContent(content)" class="btn btn-success text-light me-3"><i class="bi bi-pencil-square"></i></button>
          <button @click="DeleteContent(content)" class="btn btn-danger text-light me-3"><i class="bi bi-trash"></i></button>
          <button @click="ChangeOrder(content, index, true)" class="btn btn-primary text-light me-2"><i class="bi bi-arrow-up"></i></button>
          <button @click="ChangeOrder(content, index, false)" class="btn btn-warning text-light"><i class="bi bi-arrow-down"></i></button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref, inject, defineProps } from "vue";
import { useFirestore } from "vuefire";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRoute, useRouter } from "vue-router";

const db = useFirestore();
const firebaseConfig = inject("firebaseConfig");

const router = useRouter();
const route = useRoute();

const Notify = inject("Notify");
const GetContents = inject("GetContents");

const file = ref();
const cont = ref();

const props = defineProps({
  contents: Array,
});

const GoContent = async (content) => {
  router.push({
    name: "Content",
    params: {
      pageId: route.params.pageId,
      contentId: content.id,
    },
  });
};

const DeleteContent = async (content) => {
  await deleteDoc(doc(db, "pages", route.params.pageId, "contents", content.id)).then(() => {
    Notify("İçerik Başarıyla Silindi.", "bg-success");
    GetContents();
  });
};

const ChangeOrder = async (content, index, isDecrease) => {
  const otherContent = ref();
  otherContent.value = isDecrease ? props.contents[index - 1] : props.contents[index + 1];

  if (otherContent.value != null) {
    await setDoc(doc(db, "contents", content.id), {
      contentName: content.contentName,
      contentTitle: content.contentTitle,
      contentMedia: content.contentMedia,
      contentText: content.contentText,
      contentOrder: otherContent.value.contentOrder,
    });

    await setDoc(doc(db, "contents", otherContent.value.id), {
      contentName: otherContent.value.contentName,
      contentTitle: otherContent.value.contentTitle,
      contentMedia: otherContent.value.contentMedia,
      contentText: otherContent.value.contentText,
      contentOrder: content.contentOrder,
    }).then(() => {
      Notify("İçerik Sırası Başarıyla Değiştirildi.", "bg-success");
      GetContents();
    });
  } else {
    Notify("İçerik Sırası Değiştirilemez!", "bg-danger");
  }
};

const FileUpload = async (content, event) => {
  file.value = event.target.files[0];
  if (file.value) {
    cont.value = content;
    await uploadImageToStorage(file.value).then((storageReference) => {
      setDownloadUrl(storageReference);
    });
  } else {
    Notify("Lütfen bir media seçiniz!", "bg-danger");
  }
};

const uploadImageToStorage = async (file) => {
  const storage = getStorage(firebaseConfig);
  const storageReference = storageRef(storage, "images/", file.name);
  await uploadBytes(storageReference, file);
  return storageReference;
};

const setDownloadUrl = async (storageReference) => {
  const downloadURL = await getDownloadURL(storageReference);
  cont.value.contentMedia = downloadURL;
  setContentMedia();
};

const setContentMedia = async () => {
  await setDoc(doc(db, "pages", route.params.pageId, "contents", cont.value.id), {
    contentName: cont.value.contentName,
    contentTitle: cont.value.contentTitle,
    contentMedia: cont.value.contentMedia,
    contentText: cont.value.contentText,
  });
  Notify("Resim Başarıyla Eklendi.", "bg-success");
};
</script>
