<template>
  <nav class="nav flex-column nav-pills nav-fill w-100">
    <router-link :to="{ name: 'Company' }" class="nav-link active mb-2"
      ><i class="bi bi-menu-button-wide me-2"></i>Şirket Bilgileri</router-link
    >
    <router-link :to="{ name: 'Pages' }" class="nav-link active mb-2"
      ><i class="bi bi-menu-button-wide me-2"></i>Sayfalar</router-link
    >
  </nav>
</template>
