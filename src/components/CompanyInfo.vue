<template>
  <form>
    <div class="form-group row">
      <div class="form-group col-md-6">
        <label for="companyName">Adı</label>
        <input v-model="company.companyName" type="text" id="companyName" class="form-control" placeholder="Adı" />
      </div>
      <div class="form-group col-md-6">
        <label for="companyLogo">Logo</label>
        <div class="d-flex justify-content-start align-items-center position-relative">
          <img v-if="company.companyLogo" :src="company.companyLogo" style="width: 125px" id="companyLogo" />
          <img v-else src="https://mdbootstrap.com/img/Photos/Others/placeholder.jpg" style="width: 125px" />
          <label class="btn btn-sm btn-secondary input-group-text position-absolute" for="inputFile" style="top: 0px; left: 105px">
            <i class="bi bi-pencil-square"></i>
          </label>
          <input type="file" class="form-control" id="inputFile" style="display: none" @change="FileUpload" />
        </div>
      </div>
    </div>
    <div class="form-group row mt-5">
      <label for="companyAddress">Adres</label>
      <textarea v-model="company.companyAddress" placeholder="Adres" id="companyAddress" class="form-control"></textarea>
    </div>
    <div class="form-group row mt-5">
      <label for="companyMap">Google Haritalar Linki</label>
      <input v-model="company.companyMap" type="text" id="companyMap" class="form-control" placeholder="Google Haritalar Linki" />
    </div>
    <div class="form-group row mt-5">
      <div class="form-group col-md-4">
        <label for="companyPhone">Telefon</label>
        <input v-model="company.companyPhone" type="text" id="companyPhone" class="form-control" placeholder="Telefon" />
      </div>
      <div class="form-group col-md-4">
        <label for="companyMail">Email</label>
        <input v-model="company.companyMail" type="text" id="companyMail" class="form-control" placeholder="Email" />
      </div>
      <div class="form-group col-md-4">
        <label for="companyFax">Fax</label>
        <input v-model="company.companyFax" type="text" id="companyFax" class="form-control" placeholder="Fax" />
      </div>
    </div>
    <div class="form-group row mt-5">
      <label for="companyDesc">Açıklama</label>
      <textarea v-model="company.companyDesc" rows="5" placeholder="Açıklama" id="companyDesc" class="form-control"></textarea>
    </div>
    <div class="form-group row mt-5">
      <label for="companyDisplayDesc">Açıklama Görünüm</label>
      <textarea v-model="company.companyDisplayDesc" rows="5" placeholder="Açıklama Görünüm" id="companyDisplayDesc" class="form-control"></textarea>
    </div>
    <div class="form-group row mt-5">
      <div class="form-group col-md-4">
        <label for="companyFacebook">Facebook</label>
        <input v-model="company.companyFacebook" type="text" id="companyFacebook" class="form-control" placeholder="Facebook" />
      </div>
      <div class="form-group col-md-4">
        <label for="companyTwitter">Twitter</label>
        <input v-model="company.companyTwitter" type="text" id="companyTwitter" class="form-control" placeholder="Twitter" />
      </div>
      <div class="form-group col-md-4">
        <label for="companyInstagram">Instagram</label>
        <input v-model="company.companyInstagram" type="text" id="companyInstagram" class="form-control" placeholder="Instagram" />
      </div>
    </div>
    <div class="form-group row mt-5">
      <button type="button" @click="UpdateCompany(company)" class="btn btn-sm btn-primary w-25 m-2 ms-auto">Güncelle</button>
    </div>
  </form>
</template>

<script setup>
import { ref, inject, defineProps } from "vue";
import { doc, setDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const db = useFirestore();
const firebaseConfig = inject("firebaseConfig");

const Notify = inject("Notify");
const GetCompany = inject("GetCompany");

const file = ref();

const props = defineProps({
  company: Object,
});

const UpdateCompany = async (company) => {
  if (company.companyName == null || company.companyName == "" || company.companyPhone == null || company.companyPhone == "") {
    Notify("Lütfen Gerekli Alanları Doldurunuz.", "bg-danger");
    return false;
  }
  await setDoc(doc(db, "company", company.id), {
    companyName: company.companyName || "",
    companyLogo: company.companyLogo || "",
    companyDesc: company.companyDesc || "",
    companyDisplayDesc: company.companyDisplayDesc || "",
    companyAddress: company.companyAddress || "",
    companyPhone: company.companyPhone || "",
    companyFax: company.companyFax || "",
    companyMail: company.companyMail || "",
    companyMap: company.companyMap || "",
    companyFacebook: company.companyFacebook || "",
    companyTwitter: company.companyTwitter || "",
    companyInstagram: company.companyInstagram || "",
  }).then(() => {
    Notify("Firma Bilgileri Başarıyla Güncellendi.", "bg-success");
    GetCompany();
  });
};

const FileUpload = async (event) => {
  file.value = event.target.files[0];
  if (file.value) {
    await UploadImageToStorage(file.value).then((storageReference) => {
      SetDownloadurl(storageReference);
    });
  }
};

const UploadImageToStorage = async (file) => {
  const storage = getStorage(firebaseConfig);
  const storageReference = storageRef(storage, "images/" + file.name);
  await uploadBytes(storageReference, file);

  return storageReference;
};

const SetDownloadurl = async (storageReference) => {
  const downloadURL = await getDownloadURL(storageReference);
  props.company.companyLogo = downloadURL;
  Notify("Resim Başarıyla Eklendi.", "bg-success");
};
</script>
