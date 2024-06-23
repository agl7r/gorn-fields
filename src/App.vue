<script setup lang="ts">
import { ref, type Ref, type UnwrapRef } from 'vue'
import { fetchFields, isSectionsValid, getSectionsValues, type Section } from './fields.ts'
import FieldsForm from './FieldsForm.vue'

const ready: Ref<boolean> = ref(false)

const personSections: Ref<UnwrapRef<Section[]>> = ref([])
const companySections: Ref<UnwrapRef<Section[]>> = ref([])

Promise.all([
  fetchFields('person'),
  fetchFields('company'),
]).then(([fetchedPersonSections, fetchedCompanySections]) => {
  personSections.value = fetchedPersonSections
  companySections.value = fetchedCompanySections
  ready.value = true
})

const log: Ref<string[]> = ref([])

const onSubmit = (name: string, sections) => {
  const values = getSectionsValues(sections)
  console.log('Отправлено значение: ', values)
  log.value.push(JSON.stringify(values))
}
</script>

<template>
  <p v-if="!ready">
    Загрузка...
  </p>
  <template v-else>
    <div class="forms">
      <form @submit.prevent="onSubmit('person', personSections)">
        <fields-form v-model="personSections"></fields-form>
        <p>
          <button type="submit" :disabled="!isSectionsValid(personSections)">Сохранить</button>
        </p>
      </form>

      <form @submit.prevent="onSubmit('company', companySections)">
        <fields-form v-model="companySections"></fields-form>
        <p>
          <button type="submit" :disabled="!isSectionsValid(companySections)">Сохранить</button>
        </p>
      </form>
    </div>
    <div>
      <div v-for="record in log">
        {{ record }}
      </div>
    </div>
  </template>
</template>

<style>
.forms {
  display: flex;
}
form {
  border: 1px solid gray;
  padding: 10px;
  margin: 10px;
}
</style>
