<template>
  <div class="card relative z-2">
    <Menubar :model="items">
      <template #start>
        <img alt="logo" src="https://img.rakbow.com/common/logo/logo.png" height="40" class="mr-2" />
      </template>
      <template #end>
        <Button v-if="!userStore.isAuthenticated" icon="pi pi-sign-in" text rounded @click="openLogin"></Button>
        <Button v-if="userStore.isAuthenticated" icon="pi pi-sign-out" text rounded @click="logout"></Button>
        <InputText placeholder="Search" type="text" class="mr-2" />
        <Avatar v-if="userStore.isAuthenticated" :image="userStore.user.headerUrl" class="mr-2" size="large" shape="circle" />
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import {ref, onMounted, markRaw, defineAsyncComponent, getCurrentInstance, computed, watch, onBeforeMount} from "vue";
import { useDialog } from 'primevue/usedialog';
import { logout } from '@/logic/login';
import {useUserStore} from "@/store/user";
const webText = getCurrentInstance().appContext.config.globalProperties.webText;
const Login = defineAsyncComponent(() => import('@/components/Login.vue'));
const DialogFooter = defineAsyncComponent(() => import('@/components/common/DialogFooter.vue'));

onMounted(() => {

})

const userStore = useUserStore();

onBeforeMount(() => {
})

const dialog = useDialog();

const openLogin = () => {
  const dialogRef = dialog.open(Login, {
    props: {
      header: webText.SignIn,
      style: {
        width: '40vw',
      },
      breakpoints:{
        '960px': '65vw',
        '640px': '70vw'
      },
      modal: true
    },
    templates: {
      // footer: markRaw(DialogFooter)
    }
  });
}

const items = ref([
  {
    label: 'File',
    icon: 'pi pi-fw pi-file',
    items: [
      {
        label: 'New',
        icon: 'pi pi-fw pi-plus',
        items: [
          {
            label: 'Bookmark',
            icon: 'pi pi-fw pi-bookmark'
          },
          {
            label: 'Video',
            icon: 'pi pi-fw pi-video'
          }
        ]
      },
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-trash'
      },
      {
        separator: true
      },
      {
        label: 'Export',
        icon: 'pi pi-fw pi-external-link'
      }
    ]
  },
  {
    label: 'Edit',
    icon: 'pi pi-fw pi-pencil',
    items: [
      {
        label: 'Left',
        icon: 'pi pi-fw pi-align-left'
      },
      {
        label: 'Right',
        icon: 'pi pi-fw pi-align-right'
      },
      {
        label: 'Center',
        icon: 'pi pi-fw pi-align-center'
      },
      {
        label: 'Justify',
        icon: 'pi pi-fw pi-align-justify'
      }
    ]
  },
  {
    label: 'Users',
    icon: 'pi pi-fw pi-user',
    items: [
      {
        label: 'New',
        icon: 'pi pi-fw pi-user-plus'
      },
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-user-minus'
      },
      {
        label: 'Search',
        icon: 'pi pi-fw pi-users',
        items: [
          {
            label: 'Filter',
            icon: 'pi pi-fw pi-filter',
            items: [
              {
                label: 'Print',
                icon: 'pi pi-fw pi-print'
              }
            ]
          },
          {
            label: 'List',
            icon: 'pi pi-fw pi-bars'
          }
        ]
      }
    ]
  },
  {
    label: 'Events',
    icon: 'pi pi-fw pi-calendar',
    items: [
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'Save',
            icon: 'pi pi-fw pi-calendar-plus'
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-calendar-minus'
          }
        ]
      },
      {
        label: 'Archieve',
        icon: 'pi pi-fw pi-calendar-times',
        items: [
          {
            label: 'Remove',
            icon: 'pi pi-fw pi-calendar-minus'
          }
        ]
      }
    ]
  },
  {
    label: 'Quit',
    icon: 'pi pi-fw pi-power-off'
  }
]);

const openSearchPanel = () => {

};
</script>

<style scoped>

</style>