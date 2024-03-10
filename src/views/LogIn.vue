<template>
  <form>
    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input type="email" v-model="email" class="form-control" id="email" aria-describedby="email" />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Şifre</label>
      <input type="password" v-model="password" class="form-control" id="password" />
    </div>
    <div class="d-flex justify-content-between">
      <button type="submit" @click="login" class="btn btn-primary">Giriş Yap</button>
      <button type="button" @click="GoRegister" class="btn btn-secondary me-3">Üye Değil Misin? Üye Ol</button>
    </div>
  </form>
</template>

<script setup>
import { ref, inject } from "vue";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const Notify = inject("Notify");

const store = useStore();

const router = useRouter();
const email = ref("");
const password = ref("");

const login = async () => {
  try {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email.value, password.value).then((userCredential) => {
      store.commit("SetCurrentUser", userCredential.user);
      Notify("Giriş başarılı, içeriklere yönlendiriliyorsunuz..", "bg-success");
      router.push({
        name: "Pages",
      });
    });
  } catch (error) {
    Notify("Giriş başarısız! Lütfen tekrar deneyin..", "bg-danger");
  }
};

function GoRegister() {
  router.push({
    name: "SignIn",
  });
}
</script>
