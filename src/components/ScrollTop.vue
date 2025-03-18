<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isVisible = ref(false);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const checkScroll = () => {
  isVisible.value = window.scrollY > 200;
};

onMounted(() => {
  window.addEventListener('scroll', checkScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
});
</script>

<template>
  <button v-if="isVisible" @click="scrollToTop" class="scroll-to-top">
    Наверх
  </button>
</template>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 20px;
  left: 60px;
  padding: 10px 20px;
  background-color: burlywood;
  color: white;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.scroll-to-top:hover {
  opacity: 1;
}
</style>