import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

import SecureLS from "secure-ls";
var ls = new SecureLS({ isCompression: false });

export default createStore({
  state: {
    currentUser: null,
    isAuth: null,
  },
  mutations: {
    SetCurrentUser(state, user) {
      state.currentUser = user;
      state.isAuth = true;
    },
    LogoutUser(state) {
      state.currentUser = null;
      state.isAuth = false;
    },
  },
  actions: {
    SetCurrentUser({ commit }, user) {
      commit("SetCurrentUser", user);
    },
  },
  getters: {
    GetCurrentUser(state) {
      const user = state.currentUser;
      delete user?.password;
      return user;
    },
    GetCurrentUserName: (state) => state?.currentUser?.email,
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key, value) => ls.remove(key),
      },
    }),
  ],
});
