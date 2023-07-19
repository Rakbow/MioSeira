<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="layout-topbar flex align-items-center justify-content-between">
    <div class="mobile-menu-wrapper">
      <a href="/">
        <img src="https://img.rakbow.com/common/logo/logo.png" alt="logo" id="mobile-logo">
      </a>
    </div>
    <div class="layout-topbar-left">
      <a href="/">
        <img src="https://img.rakbow.com/common/logo/logo.png" alt="prime" id="topbar-logo">
      </a>
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
        <li th:if="${loginUser == null}"><a href="/login">Login</a></li>
        <li th:if="${loginUser != null}"><a href="/logout">Logout</a></li>
        <li th:if="${loginUser != null}">
          <Avatar th:if="${loginUser != null}" th:image="${loginUser.headerUrl}" size="small"
                    shape="circle" id="scheme-button" class="button scheme-button shadow-1"></Avatar>
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

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
