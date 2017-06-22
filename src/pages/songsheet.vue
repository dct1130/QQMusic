<template lang="html">
  <section class="songsheet-warp" :style="bg">
    <div class="songsheet-top">
      <div class="back" @click="$router.go(-1)"></div>
      <div class="songsheet-bg" :style="logo"></div>
      <div class="songsheet-title">
        <div class="left">
          <h1 id="title">
            <span v-text="title"></span>
          </h1>
          <p v-if="type=='recom'"><span>{{cdlist.visitnum | total}}人播放</span>来自：{{cdlist.nickname}}</p>
          <p v-else>{{cdlist.date}} 更新</p>
        </div>
        <router-link tag="div" class="right" :to="'/player/'+songid+'/'+type+'/0'"></router-link>
      </div>
      <div class="songsheet-gradient" :style="grade"></div>
    </div>
    <div class="songsheet-mid">
      <ul>
        <router-link tag="li" :to="'/player/'+songid+'/'+type+'/'+index"  v-for="(songlist,index) in cdlist.songlist">
          <h6 v-if="type=='recom'" v-text="songlist.title"></h6>
          <h6 v-else v-text="songlist.data.songname"></h6>
          <p v-if="type=='recom'">{{songlist.singer[0].name}} · {{songlist.album.name}}</p>
          <p v-else v-text="songlist.data.singer"></p>
        </router-link>
      </ul>
    </div>
    <div class="songsheet-btm" v-if="type=='recom'">
      <h6 class="title">标签</h6>
      <div class="tag">
        <a href="javascript:viod(0);" v-for="tags in cdlist.tags" v-text="tags.name"></a>
      </div>
      <h6 class="title">简介</h6>
      <div class="content" v-html="cdlist.desc"></div>
    </div>
    </section>
</template>

<script>
import api from '../api'
import '../../static/js/rgbaster'
import '../filter/filters'
// import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      id: '',
      type: '',
      title: '',
      cdlist: '',
      logo: '',
      bg: '',
      grade: '',
      songid: ''
    }
  },
  created () {
    this.id = this.$route.params.id
    this.type = this.$route.params.type
    this.$store.dispatch('setShowLoading', true)
  },
  mounted () {
    if (this.type === 'recom') {
      this.getSongSheet()
    } else {
      this.getRankSheet()
    }
  },
  // computed: {
  //   ...mapGetters(['showLoading'])
  // },
  methods: {
    // 获取专辑歌单
    getSongSheet () {
      var self = this
      api.getSongSheet({
        disstid: self.id
      })
      .then(res => {
        self.SheetCallback(res.cdlist[0])
      })
      .catch(res => {
        console.log(res)
      })
    },
    // 获取排行版歌单
    getRankSheet () {
      let self = this
      api.getRankSheet({
        topid: self.id
      })
      .then(res => {
        for (let i = 0, j = res.songlist.length; i < j; i++) {
          let singer = ''
          for (let k = 0, f = res.songlist[i].data.singer.length; k < f; k++) {
            singer += res.songlist[i].data.singer[k].name + ' / '
          }
          res.songlist[i].data.singer = singer.substr(0, singer.length - 3) + (res.songlist[i].data.albumname ? ' · ' + res.songlist[i].data.albumname : '') + (res.songlist[i].data.albumdesc ? ' · ' + res.songlist[i].data.albumdesc : '')
        }
        self.SheetCallback(res)
      })
      .catch(res => {
        console.log(res)
      })
    },
    SheetCallback (res) {
      let self = this
      let logoPic = ''
      self.cdlist = res
      if (self.type === 'recom') {
        logoPic = self.cdlist.logo
        self.title = self.cdlist.dissname
        self.songid = self.cdlist.songids
      } else {
        logoPic = self.cdlist.topinfo.pic_album
        self.title = self.cdlist.topinfo.ListName
        for (let i = 0, l = self.cdlist.songlist.length; i < l; i++) {
          self.songid += self.cdlist.songlist[i].data.songid + ','
        }
      }
      self.logo = 'background-image:url(\'' + logoPic + '\')'
      // 根据图片生成对应背景
      window.RGBaster.colors(logoPic, {
        paletteSize: 30,  // 调色板大小
        // exclude: ['rgba(255,255,255)'],  // 不包括白色
        success (payload) {
          // console.log(payload.dominant)  //主色
          // console.log(payload.secondary) //次色
          // console.log(payload.palette)   //调色板数组
          let dominant = payload.dominant.split('rgb(')[1].split(')')[0].split(',')
          let isColor = false
          for (let i = 0, j = dominant.length; i < j; i++) {
            if (dominant[i] > 200) {
              isColor = true
              break
            }
          }
          if (!isColor) {
            self.bg = 'background-color:' + payload.dominant
            self.grade = {
              'color': payload.dominant + '!important',
              'background-image': '-webkit-linear-gradient(top, transparent, currentColor 80%)'
            }
          }
        }
      })
      setTimeout(() => {
        self.$store.dispatch('setShowLoading', false)
      }, 2000)
      this.$nextTick(() => {
        self.leftMove()
      })
    },
    // 标题动画
    leftMove () {
      let _title = document.getElementById('title')
      let _parentWidth = _title.offsetWidth
      let _childWidth = _title.childNodes[0].offsetWidth
      if (_childWidth > _parentWidth) {
        let times = (_parentWidth / _childWidth) * 8
        this.animationLeft(_title, _parentWidth, _childWidth, times)
        setInterval(() => {
          this.animationLeft(_title, _parentWidth, _childWidth, times)
        }, times * 2000)
      }
    },
    animationLeft (obj, p, c, times) {
      obj.style.transform = 'translateX(-' + (c + 10 - p) + 'px)'
      obj.style.transition = 'transform ' + times + 's linear'
      this.animationRight(obj, times)
    },
    animationRight (obj, times) {
      setTimeout(() => {
        obj.style.transform = 'translateX(10px)'
        obj.style.transition = 'transform ' + times + 's linear'
      }, times * 1000)
    }
  }
}
</script>
<style lang="less">
section.songsheet-warp{
  height: 100%;
  overflow-y: scroll;
  background: rgb(0,0,0);
}
div.songsheet-top {
    position: relative;
    div.back{
      position: absolute;;
      width: 50px;
      height: 50px;
      z-index: 30;
      &:after,
      &:before {
          display: block;
          content: '';
          width: 1px;
          height: 15px;
          background: #fff;
      }
      &:after {
          transform: rotate(-50deg);
          margin-top: -6px;
          margin-left: 20px;
      }
      &:before {
          transform: rotate(50deg);
          margin-top: 25px;
          margin-left: 20px;
      }
    }
    div.songsheet-bg {
        background-repeat: no-repeat;
        background-position: top center;
        background-size: cover;
        &:after {
            content: '';
            display: block;
            padding-top: 100%;
        }
    }
    div.songsheet-title {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        padding: 0 15px;
        box-sizing: border-box;
        color: #fff;
        display: flex;
        padding-bottom: 25px;
        z-index: 3;
        div.left {
            width: 80%;
            overflow: hidden;
            h1 {
                font-size: 24px;
                padding: 10px 0;
                white-space: nowrap;
            }
            p {
                font-size: 14px;
                span{
                  padding-right: 15px
                }
            }
        }
        div.right {
            position: absolute;
            right: 15px;
            bottom: 25px;
            width: 42px;
            height: 42px;
            border: 3px solid #fff;
            border-radius: 999px;
            &:after{
              position: absolute;
              top: 13px;
              left: 17px;
              content: '';
              width: 0px;
              height: 0px;
              border-width: 9px 15px;
              border-style: dashed dashed dashed solid;
              border-color: transparent transparent transparent #fff;
            }
        }
    }
    div.songsheet-gradient{
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      color: rgb(0,0,0);
      background-image: -webkit-linear-gradient(top, transparent, currentColor 80%);
      &:after{
        content: '';
        display: block;
        padding-top: 60%;
      }
    }
}
div.songsheet-mid{
  ul{
    padding-left: 10px;
    padding-bottom: 20px;
    li{
      height: 60px;
      padding-right: 10px;
      border-bottom:  1px solid rgba(255,255,255,.15);
      h6{
        font-size: 16px;
        padding: 11px 0 6px;
        color: #fff;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      p{
        font-size: 14px;
        color: rgba(255,255,255,.6);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
div.songsheet-btm{
  padding-top: 10px;
  color: #fff;
  h6.title{
    padding: 10px 0;
    text-align:center;
  }
  div.tag{
    padding: 10px 0;
    text-align: center;
    a{
      display: inline-block;
      border: 1px solid #fff;
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 14px;
      color: #fff;
      margin: 0 10px;
    }
  }
  div.content{
    padding: 10px 15px 30px;
    font-size: 14px;
    text-align: justify;
    line-height: 20px;
  }
}
</style>
