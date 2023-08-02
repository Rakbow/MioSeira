<template>
  <div class="card relative z-2">
    <Menubar :model="items">
      <template #start>
        <img alt="logo" src="https://img.rakbow.com/common/logo/logo.png" height="40" class="mr-2" />
      </template>
      <template #end>
        <InputText placeholder="Search" type="text" class="mr-2" />
        <Avatar v-if="user" :image="user.headerUrl" class="mr-2" size="large" shape="circle" />
      </template>
    </Menubar>
  </div>
<!--  <div class="layout-topbar flex align-items-center justify-content-between">-->
<!--    <div class="mobile-menu-wrapper">-->
<!--      <a href="/">-->
<!--        <img src="https://img.rakbow.com/common/logo/logo.png" alt="logo" id="mobile-logo">-->
<!--      </a>-->
<!--      <a class="mobile-search-button" id="mobile-search-button" @click="openSearchPanel"><i-->
<!--          class="pi pi-search"></i></a>-->
<!--    </div>-->
<!--    <div class="layout-topbar-left">-->
<!--      <a href="/">-->
<!--        <img src="https://img.rakbow.com/common/logo/logo.png" alt="logo" id="topbar-logo">-->
<!--      </a>-->
<!--      <div id="search-wrapper" class="search-wrapper">-->
<!--        <span class="inputfield-container relative ml-5 cursor-pointer">-->
<!--            <i class="pi pi-search left-icon absolute top-50"></i>-->
<!--            <input type="text" id="search-topbar" @click="openSearchPanel"-->
<!--                   class="inputfield hover:border-gray-400 cursor-pointer px-5" placeholder="Search ..."-->
<!--                   readonly="">-->
<!--            <span class="right-icon absolute top-50 surface-100">⌘ K</span>-->
<!--        </span>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="layout-topbar-right">-->
<!--      <ul class="flex align-items-center">-->
<!--        &lt;!&ndash;<li><a href="/db/albums">Album</a></li>-->
<!--        <li><a href="/db/books">Book</a></li>-->
<!--        <li><a href="/db/discs">DVD/BD</a></li>-->
<!--        <li><a href="/db/games">Game</a></li>-->
<!--        <li><a href="/db/merchs">Merch</a></li>&ndash;&gt;-->
<!--        <li><a href="/db">Database</a></li>-->
<!--        <li><a href="/db/list">DBList</a></li>-->
<!--        <li v-if="!user"><a href="/login">Login</a></li>-->
<!--        <li v-if="user"><a href="/logout">Logout</a></li>-->
<!--        <li v-if="user">-->
<!--          <Avatar :image="user.headerUrl" shape="circle" id="scheme-button"-->
<!--                  class="button scheme-button shadow-1"></Avatar>-->
<!--        </li>-->
<!--      </ul>-->

<!--      <div class="mobile-topbar-menu-wrapper">-->
<!--        <ul class="mobile-topbar-menu clearlist" id="mobile-topbar-menu">-->
<!--          &lt;!&ndash;<li><a href="/db/albums">Album</a></li>-->
<!--          <li><a href="/db/books">Book</a></li>-->
<!--          <li><a href="/db/discs">DVD/BD</a></li>-->
<!--          <li><a href="/db/games">Game</a></li>-->
<!--          <li><a href="/db/merchs">Merch</a></li>&ndash;&gt;-->
<!--          <li><a href="/db">Database</a></li>-->
<!--          <li><a href="/db/list">DBList</a></li>-->
<!--        </ul>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
</template>

<script setup>
import {useAuth} from "@/utils/useAuth";
import {ref, onMounted} from "vue";

const user = useAuth().getUser();

onMounted(() => {

})

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