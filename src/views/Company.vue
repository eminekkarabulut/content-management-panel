<template>
  <CompanyInfo :company="company" />
</template>

<script setup>
import { ref, onMounted, provide } from "vue";
import { useFirestore } from "vuefire";
import { collection, getDocs } from "firebase/firestore";
import CompanyInfo from "/src/components/CompanyInfo.vue";

const db = useFirestore();
const company = ref({});

onMounted(() => {
  GetCompany();
});

const GetCompany = async () => {
  await getDocs(collection(db, "company")).then((response) => {
    const companies = ref([]);
    response.forEach((doc) => {
      const company = doc.data();
      company.id = doc.id;
      companies.value.push(company);
    });
    company.value = companies.value[0];
  });
};

provide("GetCompany", GetCompany);
</script>
