<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  companies: {
    type: Array,
    required: true,
  },
  validator: (value) => {
    // 验证每个数组元素是否是合法的JSON对象
    return value.every(item => {
      return typeof item === 'object' && item !== null;
    });
  },
});

</script>

<template>
  <Fieldset :toggleable="true">
    <template #legend>
      <i class="pi pi-building"></i>
      <b>{{ $const.Companies }}</b>
    </template>
    <div class="grid ml-4" v-if="companies.length !== 0">
      <table class="table-borderless table-sm">
        <tbody class="detail-item-artists-table">
        <tr v-for="company in companies">
          <td width="150px"><strong>{{ company.role.label }}</strong></td>
          <td v-for="(member, index) of company.members" class="a_with_underline">
            <router-link :to="'/db/entry/' + member.value">
              {{ member.label }}
            </router-link>
            <span v-if="index < company.members.length - 1">, </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <span class="emptyInfo"><em>{{ $const.NoCompanies }}</em></span>
    </div>
  </Fieldset>
</template>

<style scoped>

router-link {
  display:inline
}

</style>