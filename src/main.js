import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import store from "./store";
import router from "./router";

import { initializeApp } from "firebase/app";
import { VueFire, VueFireAuth } from "vuefire";
import { getAuth } from "firebase/auth";

import Editor from "@tinymce/tinymce-vue";

export const firebaseApp = initializeApp({

});

const app = createApp(App);

app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});

app.config.globalProperties.$auth = getAuth;

app.use(store);
app.use(router);

app.component("Editor", Editor);

app.provide("firebaseConfig", firebaseApp);

app.mount("#app");
