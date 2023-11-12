<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  persons: {
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
      <i class="pi pi-users"></i>
      <b>{{ $const.Persons }}</b>
    </template>
    <div class="grid ml-4" v-if="persons.length !== 0">
      <table class="table-borderless table-sm">
        <tbody class="detail-item-artists-table">
        <tr v-for="item in persons">
          <td width="150px"><strong>{{ item.role.label }}</strong></td>
          <td v-for="(member, index) in item.members" style="display:inline" class="a_with_underline">
            <router-link :to="'/db/entry/' + member.value">
              <span style="white-space: nowrap;">{{ member.label }}</span>
            </router-link>
            <span v-if="index < item.members.length - 1">,</span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <span class="emptyInfo"><em>{{ $const.NoPerson }}</em></span>
    </div>
  </Fieldset>
</template>

<style scoped>

</style>