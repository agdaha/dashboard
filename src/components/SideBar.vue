<script setup>
import { ref, computed } from 'vue'
import MyLogo from '@/components/MyLogo.vue'
import { authStore } from '@/stories/auth'

const authstore = authStore()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(visible) {
    emit('update:modelValue', visible);
  }
});

</script>

<template>
  <Drawer v-model:visible="visible">
    <template #container="{ closeCallback }">
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-between px-6 pt-4 shrink-0">
          <MyLogo />
          <span>
            <Button
              type="button"
              @click="closeCallback"
              icon="pi pi-times"
              rounded
              outlined
            ></Button>
          </span>
        </div>
        <div class="overflow-y-auto">
          <ul class="list-none p-4 m-0">
            <li>
              <div
                v-ripple
                v-styleclass="{
                  selector: '@next',
                  enterFromClass: 'hidden',
                  enterActiveClass: 'animate-slidedown',
                  leaveToClass: 'hidden',
                  leaveActiveClass: 'animate-slideup',
                }"
                class="p-4 flex items-center justify-between text-surface-500 dark:text-surface-400 cursor-pointer p-ripple"
              >
                <span class="font-medium">Общие</span>
                <i class="pi pi-chevron-down"></i>
              </div>
              <ul class="list-none p-0 m-0 overflow-hidden">
                <li>
                  <router-link
                    to="/"
                    v-ripple
                    class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple"
                  >
                    <i class="pi pi-home mr-2"></i>
                    <span class="font-medium">Дашборд</span>
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'detail' , params: { source: 'null' } }"
                    v-ripple
                    class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple"
                  >
                    <i class="pi pi-list-check mr-2"></i>
                    <span class="font-medium">Детализация</span>
                    <!-- <span class="inline-flex items-center justify-center ml-auto bg-primary text-primary-contrast rounded-full" style="min-width: 1.5rem; height: 1.5rem">3</span> -->
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
          <ul v-if="authstore.userRole == 'admin'" class="list-none p-4 m-0">
            <li>
              <div
                v-ripple
                v-styleclass="{
                  selector: '@next',
                  enterFromClass: 'hidden',
                  enterActiveClass: 'animate-slidedown',
                  leaveToClass: 'hidden',
                  leaveActiveClass: 'animate-slideup',
                }"
                class="p-4 flex items-center justify-between text-surface-500 dark:text-surface-400 cursor-pointer p-ripple"
              >
                <span class="font-medium">Админ</span>
                <i class="pi pi-chevron-down"></i>
              </div>
              <ul class="list-none p-0 m-0 overflow-hidden">
                <li>
                  <router-link
                    :to="{ name: 'users' }"
                    v-ripple
                    class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple"
                  >
                    <i class="pi pi-users mr-2"></i>
                    <span class="font-medium">Управление пользователями</span>
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'logs' }"
                    v-ripple
                    class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple"
                  >
                    <i class="pi pi-chart-bar mr-2"></i>
                    <span class="font-medium">Просмотр логов</span>
                  </router-link>
                </li>
                <!-- TODO <li>
                  <router-link
                    :to="{ name: 'streams' }"
                    v-ripple
                    class="flex items-center cursor-pointer p-4 rounded text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 duration-150 transition-colors p-ripple"
                  >
                    <i class="pi pi-arrow-right-arrow-left mr-2"></i>
                    <span class="font-medium">Настройка потоков файлов</span>
                  </router-link>
                </li> -->
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </Drawer>
</template>
