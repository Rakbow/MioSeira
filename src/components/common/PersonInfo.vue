<script setup>
import {defineAsyncComponent, defineProps} from 'vue';
import {useUserStore} from "@/store/user";
import {useDialog} from "primevue/usedialog";
const editor = defineAsyncComponent(() => import('@/components/common/PersonEditor.vue'));

const props = defineProps({
  personnel: {
    type: Object,
    required: true,
  },
  // validator: (value) => {
  //   // 验证每个数组元素是否是合法的JSON对象
  //   return value.every(item => {
  //     return typeof item === 'object' && item !== null;
  //   });
  // },
});

const dialog = useDialog();
const userStore = useUserStore();

const openEditDialog = () => {
  // dialog.open(editor, {
  //   props: {
  //     header: $const.Person,
  //     style: {
  //       width: '80vw',
  //     },
  //     breakpoints:{
  //       '960px': '80vw',
  //       '640px': '70vw'
  //     },
  //     modal: true,
  //     closable: false
  //   },
  //   data: {
  //     personnel: props.personnel
  //   },
  //   onClose: (options) => {
  //     if(options.data !== undefined) {
  //       if(options.data.isUpdate) {
  //         text.value = options.data.text;
  //         text2Markdown();
  //       }
  //     }
  //   }
  // });
}

</script>

<template>
  <Fieldset :toggleable="true">
    <template #legend>
      <i class="pi pi-users"></i>
      <b>{{ $const.Persons }}</b>
    </template>
    <div class="relative">
      <div v-if="userStore.user">
        <Button v-if="userStore.user.type === 0 || userStore.user.type > 1" class="p-button-link absolute top-0"
                @click="openEditDialog" style="left: 1%"
                v-tooltip.bottom="{value: $const.Edit, class: 'short-tooltip'}" >
          <template #icon>
            <span class="material-symbols-outlined">edit_note</span>
          </template>
        </Button>
      </div>

      <div class="grid ml-4" v-if="personnel.personnel.length !== 0">
        <table class="table-borderless table-sm">
          <tbody class="detail-item-artists-table">
          <tr v-for="item in personnel.personnel">
            <td width="150px"><strong>{{ item.role.label }}</strong></td>
            <td v-for="(person, index) in item.persons" style="display:inline" class="a_with_underline">
              <router-link :to="'/db/person/' + person.value">
                <span style="white-space: nowrap;">{{ person.label }}</span>
              </router-link>
              <span v-if="index < item.persons.length - 1">,</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <span class="emptyInfo"><em>{{ $const.NoPerson }}</em></span>
      </div>

    </div>
  </Fieldset>
</template>

<style scoped>

</style>