<template>
  <div class="card relative z-2">
<!--    <Menubar :model="items">-->
    <Menubar>
      <template #start>
        <img alt="logo" :src="`${$const.STATIC_DOMAIN}common/logo.png`" height="40" class="mr-2" />
      </template>
      <template #end>
        <Avatar v-if="userStore.isAuthenticated" :image="userStore.user.headerUrl" class="mr-2" shape="circle" />
        <!--        <Button label="Toggle Color Scheme" @click="toggleColorScheme()" />-->
        <Button v-if="!userStore.isAuthenticated" text rounded @click="openLogin"
                v-tooltip.bottom="{value: t('SignIn'), class: 'short-tooltip'}">
          <template #icon>
            <RIcon name="login"/>
          </template>
        </Button>
        <Button v-if="userStore.isAuthenticated" text rounded @click="logout"
                v-tooltip.bottom="{value: t('SignOut'), class: 'short-tooltip'}">
          <template #icon>
            <RIcon name="logout"/>
          </template>
        </Button>
        <!--        <InputText placeholder="Search" type="text" class="mr-2" />-->
      </template>
    </Menubar>
  </div>
</template>

<script setup lang="ts">
import {defineAsyncComponent, onBeforeMount, onMounted, ref} from "vue";
import {useDialog} from 'primevue/usedialog';
import {logout} from '@/service/login';
import {useUserStore} from "@/store/modules/user";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const Login = defineAsyncComponent(() => import('@/components/common/Login.vue'));

onMounted(() => {

})

const toggleColorScheme = () => {
  document.body.classList.toggle("my-app-dark");
}

const userStore = useUserStore() as any;

onBeforeMount(() => {
})


const openLogin = () => {
  const dialogRef = bs!.dialog.open(Login, {
    props: {
      header: t('SignIn'),
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