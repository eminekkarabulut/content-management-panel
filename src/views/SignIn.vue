<template>
  <form>
    <div class="form-group row mb-3">
      <div class="form-group col-md-12">
        <label for="name">Ad Soyad</label>
        <input v-model="name" type="text" class="form-control" id="name" placeholder="Ad Soyad" />
      </div>
    </div>
    <div class="form-group row mb-3">
      <div class="form-group col-md-12">
        <label for="username">Kullanıcı Adı</label>
        <input v-model="username" type="text" class="form-control" id="username" placeholder="Kullanıcı Adı" />
      </div>
    </div>
    <div class="form-group row mb-3">
      <div class="form-group col-md-6">
        <label for="email" class="form-label">Email</label>
        <input type="email" v-model="email" class="form-control" id="email" aria-describedby="email" />
      </div>
      <div class="form-group col-md-6">
        <label for="password" class="form-label">Şifre</label>
        <input type="password" v-model="password" class="form-control" id="password" />
      </div>
    </div>
    <div class="d-flex justify-content-between">
      <button type="submit" @click="register" class="btn btn-primary">Üye Ol</button>
      <button type="button" @click="GoLogin" class="btn btn-secondary ms-auto">Zaten Üye Misin? Giriş Yap</button>
    </div>
  </form>
</template>

<script setup>
import { ref, inject } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const Notify = inject("Notify");

const router = useRouter();

const email = ref("");
const password = ref("");
const username = ref("");
const name = ref("");

const register = async () => {
  try {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email.value, password.value).then(() => {
      Notify("Üyelik başarılı, girişe yönlendiriliyorsunuz..", "bg-success");
      GoLogin();
    });
  } catch (error) {
    Notify("Üyelik başarısız! Lütfen tekrar deneyin..", "bg-danger");
  }
};

function GoLogin() {
  router.push({
    name: "LogIn",
  });
}
</script>