<template>
  <div class="layout-topbar flex align-items-center justify-content-between">
    <div class="mobile-menu-wrapper">
      <a href="/">
        <img src="https://img.rakbow.com/common/logo/logo.png" alt="logo" id="mobile-logo">
      </a>
      <a class="mobile-search-button" id="mobile-search-button" @click="openSearchPanel"><i
          class="pi pi-search"></i></a>
    </div>
    <div class="layout-topbar-left">
      <a href="/">
        <img src="https://img.rakbow.com/common/logo/logo.png" alt="logo" id="topbar-logo">
      </a>
      <div id="search-wrapper" class="search-wrapper">
                <span class="inputfield-container relative ml-5 cursor-pointer">
                    <i class="pi pi-search left-icon absolute top-50"></i>
                    <input type="text" id="search-topbar" @click="openSearchPanel"
                           class="inputfield hover:border-gray-400 cursor-pointer px-5" placeholder="Search ..."
                           readonly="">
                    <span class="right-icon absolute top-50 surface-100">⌘ K</span>
                </span>
      </div>
    </div>
    <div class="layout-topbar-right">
      <ul class="flex align-items-center">
        <!--<li><a href="/db/albums">Album</a></li>
        <li><a href="/db/books">Book</a></li>
        <li><a href="/db/discs">DVD/BD</a></li>
        <li><a href="/db/games">Game</a></li>
        <li><a href="/db/merchs">Merch</a></li>-->
        <li><a href="/db">Database</a></li>
        <li><a href="/db/list">DBList</a></li>
        <li v-if="!user"><a href="/login">Login</a></li>
        <li v-if="user"><a href="/logout">Logout</a></li>
        <li v-if="user">
          <Avatar :image="user.headerUrl" shape="circle" id="scheme-button" class="button scheme-button shadow-1"></Avatar>
        </li>
      </ul>

      <div class="mobile-topbar-menu-wrapper">
        <ul class="mobile-topbar-menu clearlist" id="mobile-topbar-menu">
          <!--<li><a href="/db/albums">Album</a></li>
          <li><a href="/db/books">Book</a></li>
          <li><a href="/db/discs">DVD/BD</a></li>
          <li><a href="/db/games">Game</a></li>
          <li><a href="/db/merchs">Merch</a></li>-->
          <li><a href="/db">Database</a></li>
          <li><a href="/db/list">DBList</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
  const user = null;
  const openSearchPanel = () => {

  };
</script>

<style scoped>
  @import url('@/assets/topbar.css');
</style>