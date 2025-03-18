<script setup></script>

<script setup>
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import UserService from '@/services/user.service';
import { FilterMatchMode } from '@primevue/core/api';


const toast = useToast();
const users = ref();
const currentUser = ref({});
const selectedUsers = ref();
const userDialog = ref(false);
const submitted = ref(false);
const deleteUserDialog = ref(false);
const deleteUsersDialog = ref(false);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const roles = ref([
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' }
]);

onMounted(() => {
  UserService.getUsers().then((data) => (users.value = data));
});

function openNew() {
  currentUser.value = {};
  submitted.value = false;
  userDialog.value = true;
}

function hideDialog() {
  userDialog.value = false;
  submitted.value = false;
}

function editUser(u) {
  currentUser.value = { ...u };
  console.log(currentUser.value);
  userDialog.value = true;
}

function confirmDeleteUser(u) {
  currentUser.value = u;
  deleteUserDialog.value = true;
}

function confirmDeleteSelected() {
  deleteUsersDialog.value = true;
}

function createId() {
  let max = users.value.reduce((m,i)=>m<i.id?i.id:m ,users.value[0].id)
  return max + 1
}

function findIndexById(id) {
  let index = -1;
  for (let i = 0; i < users.value.length; i++) {
      if (users.value[i].id === id) {
          index = i;
          break;
      }
  }
  return index;
}

function saveUser() {
  submitted.value = true;

  if (currentUser?.value.username?.trim()) {
      if (currentUser.value.id) {
          users.value[findIndexById(currentUser.value.id)] = currentUser.value;
          toast.add({ severity: 'success', summary: 'Успешно', detail: 'Данные пользователя обновлены', life: 3000 });
      } else {
          currentUser.value.id = createId();
          users.value.push(currentUser.value);
          toast.add({ severity: 'success', summary: 'Успешно', detail: 'Новый пользователь создан', life: 3000 });
      }

      userDialog.value = false;
      currentUser.value = {};
  }
}


function deleteUser() {
    users.value = users.value.filter((val) => val.id !== currentUser.value.id);
    deleteUserDialog.value = false;
    currentUser.value = {};
    toast.add({ severity: 'success', summary: 'Успешно', detail: 'Пользователь удален', life: 3000 });
}

function deleteSelectedUsers() {
    users.value = users.value.filter((val) => !selectedUsers.value.includes(val));
    deleteUsersDialog.value = false;
    selectedUsers.value = null;
    toast.add({ severity: 'success', summary: 'Успешно', detail: 'Пользователи удалены', life: 3000 });
}
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-6">
        <template #start>
          <Button label="Новый" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
          <Button label="Удалить" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected"
            :disabled="!selectedUsers || !selectedUsers.length" />
        </template>
      </Toolbar>
      <DataTable ref="dt" v-model:selection="selectedUsers" :value="users" dataKey="id" :paginator="true" :rows="10"
        :filters="filters" currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users">
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h2 class="m-0">Управление пользователями</h2>
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Поиск..." />
            </IconField>
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="id" header="Id" sortable style="min-width: 2rem"></Column>
        <Column field="username" header="Имя пользователя" sortable style="min-width: 10rem"></Column>
        <Column field="password" header="Пароль" sortable style="min-width: 10rem"></Column>
        <Column field="role" header="Роль" sortable style="min-width: 10rem"></Column>
        <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editUser(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteUser(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="userDialog" :style="{ width: '450px' }" header="Пользователь" :modal="true">
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">Имя</label>
          <InputText id="name" v-model="currentUser.username" required="true" fluid />
        </div>
        <div>
          <label for="password" class="block font-bold mb-3">Пароль</label>
          <InputText id="password" v-model="currentUser.password" required="true" fluid />
        </div>
        <div>
          <span class="block font-bold mb-4">ВЫберите роль</span>
          <div class="grid grid-cols-12 gap-4">
            <div class="flex items-center gap-2 col-span-6" v-for="r in roles" :key="r.value">
              <RadioButton :inputId="r.label" v-model="currentUser.role" :name="role" :value="r.value" />
              <label>{{ r.label }}</label>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Отменить" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Сохранить" icon="pi pi-check" @click="saveUser" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="currentUser">Вы уверены, что хотите удалить <b>{{ currentUser.username }}</b>?</span>
      </div>
      <template #footer>
        <Button label="Нет" icon="pi pi-times" text @click="deleteUserDialog = false" />
        <Button label="Да" icon="pi pi-check" @click="deleteUser" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteUsersDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="currentUser">Вы действительно хотите удалить выбранных пользователей?</span>
      </div>
      <template #footer>
        <Button label="Нет" icon="pi pi-times" text @click="deleteUsersDialog = false" />
        <Button label="Да" icon="pi pi-check" text @click="deleteSelectedUsers" />
      </template>
    </Dialog>
  </div>
  <Toast />
</template>

<style scoped></style>
