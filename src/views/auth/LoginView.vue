<script setup>
import { ref } from 'vue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useToast } from 'primevue/usetoast'
import { authStore } from "@/stories/auth";
import { useRouter } from 'vue-router'


const router = useRouter()
const toast = useToast()
const user = authStore()

const initialValues = ref({
  username: '',
  password: '',
})

const resolver = zodResolver(
  z.object({
    username: z.string().min(1, { message: 'Username is required.' }),
    password: z
      .string()
      .min(3, { message: 'Minimum 3 characters.' })
      .max(8, { message: 'Maximum 8 characters.' }),
    // .refine((value) => /[a-z]/.test(value), {
    //     message: 'Must have a lowercase letter.'
    // })
    // .refine((value) => /[A-Z]/.test(value), {
    //     message: 'Must have an uppercase letter.'
    // })
    // .refine((value) => /d/.test(value), {
    //     message: 'Must have a number.'
    // })
  })
)

const onFormSubmit = (e) => {
  //TODO: проверки отключены для тестового варианта
  // e.originalEvent: Represents the native form submit event.
  // e.valid: A boolean that indicates whether the form is valid or not.
  // e.states: Contains the current state of each form field, including validity status.
  // e.errors: An object that holds any validation errors for the invalid fields in the form.
  // e.values: An object containing the current values of all form fields.
  // e.reset: A function that resets the form to its initial state.
  if (e.valid) {
    user.login(e.values).then(
      () => {
        toast.add({ severity: 'success', summary: 'Успешная аутентификация.', life: 3000 })
        router.push({ name: 'dashboard' })
      },
      (error) => {
        const message =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString()
        toast.add({ severity: 'error', summary: message, detail: error.response.data.detail, life: 3000 })
      }
    )
  }
}
</script>

<template>
  <div class="card flex justify-center login-view " style="width: 25rem;">
    <MyLogo />

    <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit"
      class="flex flex-col gap-4 w-full sm:w-60 m-10">
      <div class="flex flex-col gap-1">
        <InputText name="username" type="text" placeholder="Username" fluid />
        <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{
      $form.username.error.message
    }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <Password name="password" placeholder="Password" :feedback="false" toggleMask fluid />
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
          <ul class="my-0 px-4 flex flex-col gap-1">
            <li v-for="(error, index) of $form.password.errors" :key="index">
              {{ error.message }}
            </li>
          </ul>
        </Message>
      </div>
      <Button type="submit" severity="secondary" label="Submit" />
    </Form>
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
}
</style>
