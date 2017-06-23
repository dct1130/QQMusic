<template lang="html">
  <section class="player-container">
    <div class="head">
      <span class="back" @click="$router.go(-1)"></span>
      <div class="text">
        <h6 v-text="songName"></h6>
        <p>— {{singer}} —</p>
      </div>
      <div class="right"></div>
    </div>
    <div class="lyric" :class="{'uplist':playList}">
      <div class="lyric-loading" v-show="!lyric">Loading...</div>
      <ul class="scroll" id="lyricContainer">
        <li v-for="(l,index) in lyric" v-text="l[1]" :id="'line-'+index"></li>
      </ul>
    </div>
    <div class="control" v-show="!playList">
      <div class="porgress">
        <span class="curr-time" v-text="currentTime"></span>
        <div class="porgress-box" id="porgress-box">
          <div class="porgress-line" :style="styleWidth"></div>
          <div class="move" :style="styleLeft"></div>
        </div>
        <span class="total-time" v-text="totalDuration"></span>
      </div>
      <div class="control-btn">
        <div class="play-mode" @click="switchMode"><i class="iconfont" :class="{'icon-ttpodicon':playMode==0,'icon-danquxunhuan':playMode==1,'icon-suijibofang':playMode==2}"></i></div>
        <div class="prev-song" @click="LastSong"><i class="iconfont icon-shangyiqu"></i></div>
        <div class="play-pasued" @click="playPause"><i class="iconfont" :class="{true:'icon-zanting',false:'icon-bofang'}[playing]"></i></div>
        <div class="next-song" @click="nextSong"><i class="iconfont icon-xiayiqu"></i></div>
        <div class="song-list" @click="showSongList"><i class="iconfont icon-liebiao"></i></div>
      </div>
    </div>
    <div class="songlist"  :class="{'show':playList}">
      <div class="title">播放列表（{{songNum + 1}}）</div>
      <div class="swiper-container" id="playlist">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(list,index) in songList" :class="{'active': idx == index}" @click="selectSong(list,index)">{{list.songname}} - <span :class="{'active': idx == index}">{{list.singername}}</span></div>
        </div>
      </div>
      <div class="close" @click="hideSongList">关闭</div>
    </div>
    <div class="bg bg-blur" :style="pic"></div>
    <div class="bg bg-mask"></div>
    <audio :src="src"></audio>
  </section>
</template>

<script>
import api from '../api'
import Swiper from '../../static/js/swiper.min'
export default {
  data () {
    return {
      id: '',
      type: '',
      musicid: '', // 歌曲ID
      pic: '',  // 歌手图片
      idx: 0,   // 当前播放歌曲索引
      songNum: 0, // 歌曲数量
      mySwiper: null,
      playList: false,  // 播放列表
      playMode: 0,  // 播放模式
      songList: [],  // 歌曲对象
      audio: null,  // 播放器
      src: '',    // 歌曲地址
      playing: false, // 是否播放
      singer: '',  // 歌手
      songName: '',  // 歌曲名称
      totalDuration: '00:00', // 歌曲总时长
      currentTime: '00:00',  // 当前播放时间
      styleWidth: '',  // 进度条
      styleLeft: '', // 拖动点
      interval: null,  // 时间进度定时器
      progBox: null,  // 进度条容器
      startX: 0,  // 当前点击位置
      lyric: '', // 歌词
      lyricContainer: null // 歌词容器
    }
  },
  created () {
    this.id = this.$route.params.id
    this.type = this.$route.params.type
    this.idx = parseInt(this.$route.params.index)
  },
  mounted () {
    this.type === 'radio' ? this.getMusicId() : this.getMusicList(this.id)
    this.audio = document.getElementsByTagName('audio')[0]
    this.progBox = document.getElementById('porgress-box')
    this.lyricContainer = document.getElementById('lyricContainer')
  },
  methods: {
    getMusicId () {
      let self = this
      api.getMusicId({
        labelid: self.id
      })
      .then(res => {
        let data = res.data
        let songid = ''
        for (var i = 0, j = data.length; i < j; i++) {
          songid += data[i].id + ','
        }
        self.getMusicList(songid)
      })
      .catch(res => {
        console.log(res)
      })
    },
    getMusicList (songid) {
      api.getMusicList({
        ADTAG: 'myqq',
        from: 'myqq',
        // channel: '10007100',
        songid: songid
      })
      .then(res => {
        if (res) {
          let songlist1 = res.substr(res.indexOf('songlist=') + 9)
          this.songList = JSON.parse(songlist1.substr(0, songlist1.indexOf('];') + 1))
          this.songNum = this.songList.length - 1
          this.$nextTick(() => {
            this.initSwiper()
            this.selectSong(this.songList[this.idx], this.idx)
            this.monitorSongEnd()
            this.monitorTouch()
          })
        } else {
          this.$store.dispatch('setToastMsg', '网络异常请返回重试！')
          this.$store.dispatch('setShowToast', true)
        }
      })
      .catch(res => {
        console.log(res)
      })
    },
    // 初始化歌曲滑动列表
    initSwiper () {
      this.mySwiper = new Swiper('#playlist', {
        direction: 'vertical',
        slidesPerView: 'auto',
        freeMode: true
      })
    },
    // 展开歌曲列表
    showSongList () {
      this.playList = true
      this.$nextTick(() => {
        this.mySwiper.update()
      })
    },
    // 关闭歌曲列表
    hideSongList () {
      this.playList = false
    },
    // 切换播放方式
    switchMode () {
      switch (this.playMode) {
        case 0:
          this.playMode = 1
          this.$store.dispatch('setToastMsg', '单曲循环')
          this.$store.dispatch('setShowToast', true)
          break
        case 1:
          this.playMode = 2
          this.$store.dispatch('setToastMsg', '随机播放')
          this.$store.dispatch('setShowToast', true)
          break
        case 2:
          this.playMode = 0
          this.$store.dispatch('setToastMsg', '循环播放')
          this.$store.dispatch('setShowToast', true)
          break
      }
    },
    // 播放暂停
    playPause () {
      if (!this.src) {
        return
      }
      if (this.playing) {
        this.audio.pause()
      } else {
        this.audio.play()
      }
      this.playing = !this.playing
    },
    // 上一曲
    LastSong () {
      if (this.playMode === 0 || this.playMode === 1) {
        let isTop = this.idx - 1 < 0
        if (isTop) {
          this.selectSong(this.songList[this.songNum], this.songNum)
        } else {
          this.selectSong(this.songList[this.idx - 1], this.idx - 1)
        }
      } else {
        let index = parseInt(Math.random() * this.songNum + 1)
        this.selectSong(this.songList[index], index)
      }
      this.$store.dispatch('setToastMsg', '上一曲')
      this.$store.dispatch('setShowToast', true)
    },
    // 下一曲
    nextSong () {
      if (this.playMode === 0 || this.playMode === 1) {
        let isBottom = this.idx + 1 > this.songNum
        if (isBottom) {
          this.selectSong(this.songList[0], 0)
        } else {
          this.selectSong(this.songList[this.idx + 1], this.idx + 1)
        }
      } else {
        let index = parseInt(Math.random() * this.songNum + 1)
        this.selectSong(this.songList[index], index)
      }
      this.$store.dispatch('setToastMsg', '下一曲')
      this.$store.dispatch('setShowToast', true)
    },
    // 列表歌曲选择
    selectSong (song, index) {
      this.playing = false
      this.idx = index
      this.pic = 'background-image:url(\'//y.gtimg.cn/music/photo_new/T002R150x150M000' + song.albummid + '.jpg?max_age=2592000\')'
      this.src = song.m4aUrl
      this.singer = song.singername
      this.songName = song.songname
      this.musicid = song.songid
      setTimeout(() => {
        // 播放
        this.playPause()
        // 时间进度处理
        this.timeProgress()
        // 歌词
        this.getLyric()
      }, 500)
    },
    // 时间进度处理
    timeProgress () {
      let currentTime = this.audio.currentTime
      let duration = this.audio.duration
      // 总时间
      this.totalDuration = this.songTime(duration)
      // 当前播放时间、进度
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        if (!this.audio.paused) {
          currentTime = this.audio.currentTime
          this.currentTime = this.songTime(currentTime)
          let numbs = (currentTime / duration) * (this.progBox.offsetWidth - 10)
          this.styleWidth = {
            width: numbs + 'px'
          }
          this.styleLeft = {
            left: numbs + 'px'
          }
        }
      }, 1000)
    },
    // 歌曲时间处理
    songTime (time) {
      let minute = parseInt(time / 60)
      let second = parseInt(time % 60)
      return (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
    },
    // 监听歌曲结束自动播放下一首
    monitorSongEnd () {
      this.audio.addEventListener('ended', () => {
        this.nextSong()
      }, false)
    },
    // 监听进度按下、拖动、松开事件
    monitorTouch () {
      this.progBox.addEventListener('touchstart', this.touchStart, false)
      this.progBox.children[1].addEventListener('touchmove', this.touchMove, false)
      this.progBox.addEventListener('touchend', this.touchEnd, false)
    },
    // 进度条按下
    touchStart (e) {
      this.startX = e.touches[0].clientX
      clearInterval(this.interval)
    },
    // 拖动进度条
    touchMove (e) {
      let [moveX, offsetWidth] = [e.touches[0].clientX - this.progBox.offsetLeft, (this.progBox.offsetWidth - 10)]
      moveX = moveX < 0 ? 0 : moveX
      moveX = moveX > offsetWidth ? offsetWidth : moveX
      let times = (moveX / offsetWidth) * this.audio.duration
      this.audio.currentTime = times
      this.currentTime = this.songTime(times)
      this.styleWidth = {
        width: moveX + 'px'
      }
      this.styleLeft = {
        left: moveX + 'px'
      }
    },
    // 进度条松开
    touchEnd (e) {
      this.timeProgress()
      let endX = e.changedTouches[0].clientX
      if (endX === this.startX) {
        endX = endX - this.progBox.offsetLeft
        let times = (endX / (this.progBox.offsetWidth - 10)) * this.audio.duration
        this.audio.currentTime = times
        this.styleWidth = {
          width: endX + 'px'
        }
        this.styleLeft = {
          left: endX + 'px'
        }
      }
    },
    // 获取歌词
    getLyric () {
      let self = this
      api.getLyric({
        musicid: self.musicid,
        showapi_appid: 40488,
        showapi_sign: 'fddeb51813e34655821b6922cf05335c'
      })
      .then(res => {
        if (res.showapi_res_code === 0) {
          // 歌词格式处理
          self.lyric = null
          self.lyric = self.lyricFormat(res.showapi_res_body.lyric)
          // 歌词默认距离顶部位置
          self.lyricContainer.style.top = '100px'
          // 随机取高亮歌词的样式
          let lyricStyle = Math.floor(Math.random() * 4)
          // 监听当前播放时间
          self.audio.addEventListener('timeupdate', (e) => {
            if (!self.lyric) return
            for (let i = 0, l = self.lyric.length; i < l; i++) {
              if (self.audio.currentTime > self.lyric[i][0] - 0.50) {
                let line = document.getElementById('line-' + i)
                // 取消所有高亮歌词
                for (let i = 0, l = self.lyricContainer.children.length; i < l; i++) {
                  self.lyricContainer.children[i].className = ''
                }
                // 高亮当前歌词
                line.className = 'current-line-' + lyricStyle
                // 改变歌词容器top值
                self.lyricContainer.style.top = 100 - line.offsetTop + 'px'
              }
            }
          })
        } else {
          this.$store.dispatch('setToastMsg', res.showapi_res_error || '歌词获取出错！')
        }
      })
      .catch(res => {
        console.log(res)
      })
    },
    // 歌词格式处理
    lyricFormat (lrc) {
      let div = document.createElement('div')
      div.innerHTML = lrc + ''
      let text = div.innerHTML
      // 将文本分隔成一行一行，存入数组
      let lines = text.split('\n')
      // 用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
      let pattern = /\[\d{2}:\d{2}.\d{2}\]/g
      // 保存最终结果的数组
      let result = []
      // 去掉不含时间的行
      while (!pattern.test(lines[0])) {
        lines = lines.slice(1)
      }
      // 上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
      lines[lines.length - 1].length === 0 && lines.pop()
      lines.forEach((v, i, a) => {
        // 提取出时间[xx:xx.xx]
        let time = v.match(pattern)
        // 提取歌词
        let value = v.replace(pattern, '')
        // 因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
        time.forEach((v1, i1, a1) => {
          // 去掉时间里的中括号得到xx:xx.xx
          let t = v1.slice(1, -1).split(':')
          // 将结果压入最终数组
          value && result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value])
        })
      })
      // 最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
      result.sort((a, b) => {
        return a[0] - b[0]
      })
      return result
    }
  }
}
</script>

<style lang="less">@font-face {
    font-family: "iconfont";
    src: url('../assets/iconfont/iconfont.eot?t=1496731787818');
    /* IE9*/
    src:url('../assets/iconfont/iconfont.eot?t=1496731787818#iefix') format('embedded-opentype'),
    /* IE6-IE8 */
    url('../assets/iconfont/iconfont.woff?t=1496731787818') format('woff'),
    /* chrome, firefox */
    url('../assets/iconfont/iconfont.ttf?t=1496731787818') format('truetype'),
    /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
    url( '../assets/iconfont/iconfont.svg?t=1496731787818#iconfont') format('svg');
    /* iOS 4.1- */
}

.iconfont {
    font-family: "iconfont" !important;
    font-size: 24px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #fff;
}
// 循环播放
.icon-ttpodicon:before {
    content: "\e6bf";
}
// 单曲循环
.icon-danquxunhuan:before {
    content: "\e67f";
}
// 随机播放
.icon-suijibofang:before {
    content: "\e628";
}
// 播放
.icon-bofang:before {
    content: "\e602";
    font-size: 40px;
}
// 上一曲
.icon-shangyiqu:before {
    content: "\e6e8";
    font-size: 35px;
    line-height: 36px;
}
// 暂停
.icon-zanting:before {
    content: "\e682";
    font-size: 40px;
    position: relative;
    top: 3px;
}
// 歌曲列表
.icon-liebiao:before {
    content: "\e6d6";
    line-height: 42px;
}
// 下一曲
.icon-xiayiqu:before {
    content: "\e600";
    font-size: 35px;
    line-height: 42px;
}

section.player-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 30;
    div.bg {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
    div.bg-blur {
        background-size: cover;
        background-position: bottom center;
        filter: blur(15px);
        transform: scale(1.15);
    }
    div.bg-mask {
        background: #000;
        opacity: 0.6;
    }
    div.head {
        display: flex;
        position: relative;
        z-index: 10;
        span.back {
            display: block;
            width: 50px;
            height: 50px;
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
        div.text {
            width: 60%;
            text-align: center;
            margin: 0 auto;
            color: #ffffff;
            h6 {
                height: 30px;
                line-height: 30px;
                padding-top: 12px;
                font-size: 18px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            p {
                font-size: 14px;
                padding-top: 5px;
            }
        }
        div.right {
            width: 50px;
            height: 50px;
        }

    }
    div.lyric {
      position: absolute;
      z-index: 30;
      color: #fff;
      overflow: hidden;
      top: 15%;
      text-align: center;
      width: 100%;
      bottom: 26%;
      &.uplist{
        bottom: 59%;
      }
      div.lyric-loading{
        margin-top: 20%
      }
      ul.scroll{
        position: relative;
        transition: top .3s ease;
        li{
          height: 24px;
          line-height: 24px;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &.current-line-0{
            color: #31c27c;
          }
          &.current-line-1{
            color: #dbd531;
          }
          &.current-line-2{
            color: #3de7e7;
          }
          &.current-line-3{
            color: #e23d60;
          }
        }
      }
    }
    div.control {
        position: absolute;
        padding: 0 20px;
        z-index: 30;
        bottom: 0;
        left: 0;
        right: 0;
        height: 120px;
        div.porgress {
            display: flex;
            color: #999;
            font-size: 12px;
            div.porgress-box {
                width: 80%;
                margin: 0 10px;
                height: 4px;
                position: relative;
                top: 5px;
                background: rgba(255,255,255,.2);
                border-radius: 999px;
                div.porgress-line {
                    width: 0px;
                    height: 4px;
                    background: #31c27c;
                    border-radius: 999px;
                }
                div.move{
                  position: absolute;
                  left: 0px;
                  top: -3px;
                  width: 10px;
                  height: 10px;
                  background-color: #31c27c;
                  border-radius: 999px;
                  animation: Twinkle 1s ease infinite
                }
            }
        }
        div.control-btn {
            margin-top: 25px;
            display: flex;
            div{
              width: 20%;
              height: 40px;
              line-height: 40px;
              text-align: center;
            }
            div.play-mode {}
            div.prev-song {
            }
        }
    }
    div.songlist{
      position: absolute;
      left:0px;
      right: 0px;
      bottom: 0px;
      z-index: 40;
      color: #fff;
      background:rgba(0,0,0,.4);
      height: 335px;
      transition: transform .2s ease;
      transform: translate3d(0,100%,0);
      div.title{
        height: 45px;
        line-height: 45px;
        font-size: 16px;
        padding-left: 10px;
        position: relative;
        &:after{
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          height: 1px;
          background: rgba(255,255,255,.15);
          transform: scaleY(.5);
        }
      }
      div.swiper-container{
        height: 250px;
        div.swiper-wrapper{
          padding-left: 10px;
          div.swiper-slide{
            height: 35px;
            line-height: 35px;
            font-size: 14px;
            &:after{
              content: "";
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 1;
              height: 1px;
              background: rgba(255,255,255,.15);
              transform: scaleY(.5);
            }
            span{
              font-size: 12px;
              color: #999;
              &.active{
                color: #31c27c;
              }
            }
            &.active{
              color: #31c27c;
            }
          }
        }
      }
      div.close{
        height: 40px;
        line-height: 40px;
        text-align: center;
        position: relative;
        &:after{
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          z-index: 1;
          height: 1px;
          background: rgba(255,255,255,.15);
          transform: scaleY(.5);
        }
      }
      &.show{
        transform: translate3d(0,0,0)
      }
    }
}
@keyframes Twinkle {
  0%{
    box-shadow: 0 0 5px rgba(255,255,255,.5)
  }
  50%{
    box-shadow: 0 0 10px rgba(255,255,255,1)
  }
  100%{
    box-shadow: 0 0 5px rgba(255,255,255,.5)
  }
}
</style>
