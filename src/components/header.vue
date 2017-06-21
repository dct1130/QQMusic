<template lang="html">
<header id="header">
  <div class="header"><i class="logo"></i></div>
  <nav class="nav">
    <ul>
      <router-link tag="li" to="/recom">推荐</router-link>
      <router-link tag="li" to="/rank">排行榜</router-link>
      <router-link tag="li" to="/search">搜索</router-link>
    </ul>
  </nav>
</header>
</template>

<script>
export default {
}
</script>

<style lang="less">
div.header {
    height: 44px;
    background: #31c27c;
    i.logo {
        display: block;
        width: 90px;
        height: 25px;
        background: url("../assets/img/logo.png") no-repeat left center;
        background-size: cover;
        position: relative;
        left: 10px;
        top: 10px;
    }
}
nav.nav {
    height: 40px;
    background: #fff;
    ul {
        display: flex;
        li {
            flex: 3;
            text-align: center;
            height: 40px;
            line-height: 40px;
            color: rgba(0,0,0,.6);
            position: relative;
            &.router-link-exact-active{
              color: #31c27c;
              &:after{
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                height: 2px;
                width: 100%;
                background: #31c27c;
              }
            }
        }
    }
}
</style>
