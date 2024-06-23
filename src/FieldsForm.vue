<script setup lang="ts">
const sections = defineModel()
</script>

<template>
  <template v-for="section in sections">
    <div>
      <template v-for="field in section.fields">
        <template v-if="field.type === 'string'">
          <div>
            <label>{{ field.title }}</label>
            <input type="text" :name="field.name" v-model="field.value">
            <div v-if="field.error" class="error">{{ field.error }}</div>
          </div>
        </template>

        <template v-if="field.type === 'date'">
          <label>{{ field.title }}</label>
          <input type="date" :name="field.name" v-model="field.value">
          <div v-if="field.error" class="error">{{ field.error }}</div>
        </template>

        <template v-if="field.type === 'select'">
          <label>{{ field.title }}</label>
          <select :name="field.name" v-model="field.value">
            <option v-for="option in field.possibleValues" :value="option.id">{{ option.name }}</option>
          </select>
          <div v-if="field.error" class="error">{{ field.error }}</div>
        </template>

        <template v-if="field.type === 'widget'">
          <label>{{ field.title }}</label>
          <button @click.prevent="field.value = { id: 2, name: 'Иван' }">Выбрать Ивана</button>
          {{ field.value }}
          <div v-if="field.error" class="error">{{ field.error }}</div>
        </template>
      </template>
    </div>
  </template>
</template>

<style>
label {
  display: block;
}
.error {
  color: red;
}
</style>
