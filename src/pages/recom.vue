<template lang="html">
  <section>
    <v-banner :image="list.slider"></v-banner>
    <div class="container">
      <div class="list">
        <h2>电台</h2>
        <ul>
          <router-link tag="li" :to="'/player/'+radio.radioid" v-for="radio in list.radioList">
            <div class="img">
              <img :src="radio.picUrl" alt="">
              <span class="icon"></span>
            </div>
            <div class="btm">
              <span class="music-title" v-text="radio.Ftitle"></span>
            </div>
          </router-link>
        </ul>
      </div>
      <div class="list">
        <h2>热门歌单</h2>
        <ul>
          <router-link tag="li" :to="'/songsheet/'+songList.id+'/recom'" v-for="songList in list.songList">
          <!-- <router-link tag="li" :to="{path:'/songsheet',query: {name: songList.id}}" v-for="songList in list.songList"> -->
            <div class="img">
              <img :src="songList.picUrl" alt="">
              <span class="count"><i class="headset"></i>{{songList.accessnum | total}}</span>
              <span class="icon"></span>
            </div>
            <div class="btm">
              <span class="music-title" v-text="songList.songListDesc"></span>
              <span class="music-title" v-text="songList.songListAuthor"></span>
            </div>
          </router-link>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import api from '../api'
import banner from '@/components/banner'
import '../filter/filters'

export default {
  components: {
    'v-banner': banner
  },
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取数据
    getData () {
      let self = this
      api.getRecommend()
      .then(res => {
        self.list = res.data
      })
      .catch(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="less">
div.container{
  padding:10px;
  div.list{
    h2{
      font-size: 16px;
      padding:8px 0 15px;
    }
    ul{
      display: flex;
      flex-wrap:wrap;
      li{
        display: inline-block;
        width: 48.5%;
        background: #fff;
        margin-bottom: 10px;
        &:nth-child(odd){
          margin-right: 10px;
        }
        div.img{
          position: relative;
          img{
            display:block;
            width: 100%
          }
          span.count{
            position: absolute;
            left: 5px;
            bottom: 7px;
            font-size: 12px;
            line-height: 12px;
            color: #fff;
            i.headset{
              display: block;
              width: 10px;
              height: 10px;
              float: left;
              background: url('../assets/img/list_sprite.png') no-repeat;
              background-size: 24px 60px;
              background-position: 0 -50px;
              margin:2px 5px 0 0;
            }
          }
          span.icon{
            position: absolute;
            height: 24px;
            bottom: 5px;
            right: 5px;
            width: 24px;
            background: url('../assets/img/list_sprite.png') no-repeat;
            background-size: 24px 60px;
            background-position: 0 0;
          }
        }
        div.btm{
          display: block;
          font-size: 14px;
          padding: 10px;
          span{
            line-height: 20px;
          }
          span.music-title{
            display: block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
