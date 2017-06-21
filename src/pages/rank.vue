<template lang="html">
  <ul class="rank-warp">
    <router-link class="rank-item" v-for="lists in list.topList" tag="li" :to="'/songsheet/'+lists.id+'/rank'">
      <div class="rank-media">
        <img :src="lists.picUrl" alt="">
        <span class="count"><i class="headset"></i>{{lists.listenCount | total}}</span>
      </div>
      <div class="rank-info">
        <h3 v-text="lists.topTitle"></h3>
        <p v-for="(child,index) in lists.songList">{{index}} <span v-text="child.songname"></span> - {{child.singername}}</p>
      </div>
    </router-link>
  </ul>
</template>

<script>
import api from '../api'
import '../filter/filters'
export default {
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      let self = this
      api.getRank()
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
ul.rank-warp{
  padding: 10px;
  li.rank-item{
    margin-bottom: 10px;
    background: #fff;
    display: flex;
    div.rank-media{
      width: 100px;
      height: 100px;
      position: relative;
      img{
        display: block;
        width: 100px;
        height: 100px;
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
      &:after{
        content: '';
        position: absolute;
        left:0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background-image: url('../assets/img/shadow_rp_b.png');
        background-repeat: repeat-x;
        background-size: 1px 117px;
        z-index: 1;
      }
    }
    div.rank-info{
      flex-grow:1;
      padding: 0 10px ;
      position: relative;
      overflow: hidden;
      h3{
        font-size: 16px;
        padding: 8px 0 6px
      }
      p{
        color: rgba(0,0,0,.5);
        padding: 5px 0;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        span{
          color: #000;
        }
      }
      &:after{
        content: '';
        position: absolute;
        right: 10px;
        top: 50%;
        width: 6px;
        height: 6px;
        border-top: 1px solid #b2b2b2;
        border-right: 1px solid #b2b2b2;
        transform: rotate(45deg)
      }
    }
  }
}
</style>
