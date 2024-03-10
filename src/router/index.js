import { createRouter, createWebHashHistory } from "vue-router";
import store from "/src/store/index.js";

import Pages from "/src/views/Pages.vue";
import Contents from "/src/views/Contents.vue";
import Company from "/src/views/Company.vue";
import Content from "/src/views/Content.vue";
import NewContentItem from "/src/views/NewContentItem.vue";
import SignIn from "/src/views/SignIn.vue";
import LogIn from "/src/views/LogIn.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/pages",
  },
  {
    path: "/pages",
    name: "Pages",
    component: Pages,
    meta: { requiresAuth: true },
  },
  {
    path: "/contents/:pageId",
    name: "Contents",
    component: Contents,
    meta: { requiresAuth: true },
  },
  {
    path: "/content/:pageId/:contentId",
    name: "Content",
    component: Content,
    meta: { requiresAuth: true },
  },
  {
    path: "/newContent//:pageId/:contentId",
    name: "NewContentItem",
    component: NewContentItem,
    meta: { requiresAuth: true },
  },
  {
    path: "/company",
    name: "Company",
    component: Company,
    meta: { requiresAuth: true },
  },
  {
    path: "/signIn",
    name: "SignIn",
    component: SignIn,
    meta: { requiresAuth: false },
  },
  {
    path: "/logIn",
    name: "LogIn",
    component: LogIn,
    meta: { requiresAuth: false },
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !store.state.isAuth) {
    next({ name: "LogIn" });
  } else {
    next();
  }
});

export default router;
