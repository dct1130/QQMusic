<template lang="html">
  <section id="search-warp">
    <div id="search-page">
      <div class="search">
        <div class="input">
          <input type="text" name="" v-model="keyWords" @focus="focus()" @keyup.enter="getSongList(true)" placeholder="搜索歌曲、歌单、专辑">
          <span class="clear" v-show="keyWords" @click="clearInput()"></span>
        </div>
        <span class="cancle" v-show="cancelShow" @click="cancel()">取消</span>
      </div>
      <div class="hot-tag" v-show="cancelShow==false">
        <h3>热门搜索</h3>
        <ul>
          <li class="hot" v-text="hotWords.special_key" @click="toPage(hotWords.special_url)"></li>
          <li v-for="words in hotWords.hotkey" v-text="words.k" @click="toSearch(words.k)"></li>
        </ul>
      </div>
      <div class="result-list" v-if="resultList && resShow">
        <ul>
          <router-link tag="li" v-for="songlist in resultList" :to="'/player/'+songlist.songid+'/search/0'">
              <i class="music-icon"></i>
              <h3 v-text="songlist.songname"></h3>
              <p v-text="songlist.singer"></p>
          </router-link>
          <li v-show="loadingShow" class="loading"><i v-show="loadingAni"></i>{{loadingText}}</li>
        </ul>
      </div>
      <div class="history" v-if="storage.length>0 && histortShow && !keyWords">
        <ul>
          <li v-for="(h,index) in storage" @click="toSearch(h)">
            <i class="time-icon"></i>
            <h3 v-text="h"></h3>
            <i class="close" @click.stop="del(index)"></i>
          </li>
          <li class="clearHistory" @click="clearHistory()">清除搜索记录</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import api from '../api'
export default {
  data () {
    return {
      cancelShow: false,  // 取消开关
      resShow: false, // 歌曲列表开关
      histortShow: false, // 历史记录开关
      hotWords: [], // 热门关键词
      keyWords: '', // 搜索个关键词
      resultList: null, // 歌曲列表
      storage: [],  // 历史记录
      page: 1,  // 当前页
      pagenum: 20,  // 每页数量
      totalnum: 1,  // 总页数
      singer: '', // 歌手
      loadingShow: true,  // loading开关
      loadingAni: true,  // loading动画
      loadingText: '加载中...' // loading文本
    }
  },
  mounted () {
    // 初始化
    this.init()
  },
  methods: {
    // 初始化
    init () {
      var self = this
      api.getHotWords()
      .then(res => {
        self.hotWords = res.data
      })
      .catch(res => {
        console.log(res)
      })
      this.storage = JSON.parse(localStorage.getItem('SEARCH_KEY')) || []
      this.scrollLoading()
    },
    // 跳转页面
    toPage (url) {
      window.location.href = url
    },
    // 加载歌曲列表
    getSongList (bool) {
      let self = this
      // 判断是否首次加载
      bool && (self.resultList = '')
      if (self.keyWords === '') {
        alert('请输入搜索词')
      } else {
        if (self.page > self.totalnum) {
          self.loadingAni = false
          self.loadingText = '我是有底线的！'
          return
        }
        // 隐藏历史记录
        self.histortShow = false
        if (self.storage.indexOf(self.keyWords) !== -1) {
          self.storage.splice(self.storage.indexOf(self.keyWords), 1)
          self.storage.unshift(self.keyWords)
        } else {
          self.storage.unshift(self.keyWords)
        }
        localStorage.setItem('SEARCH_KEY', JSON.stringify(self.storage))
        api.getSearch({
          w: self.keyWords,
          p: self.page
        })
          .then(res => {
            // 计算总页数
            self.totalnum === 1 && (self.totalnum = Math.ceil(res.data.song.totalnum / self.pagenum))
            let list = res.data.song.list
            let listLength = list.length

            if (listLength < 1) {
              self.loadingAni = false
              self.loadingText = '没有搜索到结果！'
            }

            for (let i = 0; i < listLength; i++) {
              for (let k = 0, h = list[i].singer.length; k < h; k++) {
                self.singer += list[i].singer[k].name + ' / '
              }
              self.singer = self.singer.substr(0, self.singer.length - 3)
              list[i].singer = self.singer
              self.singer = ''
            }
            if (self.resultList) {
              self.resultList = self.resultList.concat(list)
            } else {
              self.resultList = list
            }
            // 隐藏loading
            self.loadingShow = false
            // 显示歌曲列表
            self.resShow = true
            // 当前页数++
            self.page++
          })
          .catch(res => {
            console.log(res)
          })
      }
    },
    // 输入框获取焦点
    focus () {
      // 显示取消按钮
      this.cancelShow = true
      // 显示搜索历史记录
      this.histortShow = true
    },
    // 取消
    cancel () {
      // 隐藏历史记录、搜索结果列表、取消按钮
      this.histortShow = this.resShow = this.cancelShow = false
      // 清空输入框
      this.keyWords = ''
    },
    // 清空输入框
    clearInput () {
      // 清空输入框
      this.keyWords = ''
      // 隐藏搜索结果列表
      this.resShow = false
      // 显示历史记录
      this.histortShow = true
    },
    // 删除当前搜索历史
    del (i) {
      this.storage.splice(i, 1)
      localStorage.setItem('SEARCH_KEY', JSON.stringify(this.storage))
    },
    // 删除所有搜索历史
    clearHistory () {
      localStorage.removeItem('SEARCH_KEY')
      this.storage = []
      // 隐藏历史记录
      this.histortShow = true
    },
    // 点击热词搜索
    toSearch (key) {
      this.keyWords = key
      // 显示取消按钮
      this.cancelShow = true
      this.resultList = ''
      this.getSongList(true)
    },
    scrollLoading () {
      var self = this
      document.getElementById('search-warp').onscroll = function () {
        if (self.resShow && !self.loadingShow) {
          let scrollTop = this.scrollTop
          let domHeight = document.getElementById('search-page').offsetHeight
          let viewHeight = document.getElementById('search-warp').offsetHeight
          if (scrollTop >= domHeight - viewHeight) {
            self.loadingShow = true
            setTimeout(self.getSongList, 1000)
          }
        }
      }
    }
  }

}
</script>

<style lang="less">
#search-warp{
  height: 100%;
  overflow-y: scroll;
}
div.search {
    height: 36px;
    padding: 10px;
    display: flex;
    div.input {
        position: relative;
        flex-grow: 3;
        background: #fff url('../assets/img/seatch-icon.png') no-repeat 10px center;
        background-size: 18px 18px;
        padding: 8px 8px 8px 35px;
        display: flex;
        input {
            font-size: 14px;
            color: rgba(0,0,0,.5);
            flex-grow: 2;
        }
        span.clear {
            position: absolute;
            right: 10px;
            width: 18px;
            height: 18px;
            background: #b1b1b1;
            border-radius: 18px;
            &:after,
            &:before {
                content: '';
                display: block;
                width: 10px;
                height: 2px;
                background: #fff;
            }
            &:before {
                transform: rotate(45deg);
                margin: 8px 0 0 4px;
            }
            &:after {
                transform: rotate(-45deg);
                margin: -2px 0 0 4px;
            }
        }
    }
    span.cancle {
        flex-grow: 1;
        text-align: center;
        line-height: 36px;
        font-size: 14px;
        color: #555;
    }
}
div.hot-tag {
    background: #fff;
    padding: 10px;
    h3 {
        padding: 10px 0;
        color: rgba(0,0,0,.6);
        font-size: 14px;
        font-weight: 700;
    }
    ul {
        display: flex;
        flex-wrap: wrap;
        li {
            padding: 0 10px;
            height: 30px;
            line-height: 30px;
            border: 1px solid rgba(0,0,0,.6);
            border-radius: 30px;
            margin-right: 10px;
            margin-bottom: 10px;
            font-size: 14px;
            &.hot {
                color: #fc4524;
                border-color: #fc4524;
            }
        }
    }
}
div.result-list {
    ul {
        li {
            height: 55px;
            padding-left: 56px;
            position: relative;
            border-top: 1px solid #e5e5e5;
            background: #fff;
            overflow: hidden;

            i.music-icon {
                display: block;
                width: 22px;
                height: 20px;
                background-image: url('../assets/img/search_sprite.png');
                background-repeat: no-repept;
                background-size: 22px 30px;
                background-position: 0 0;
                position: absolute;
                left: 18px;
                top: (55-20)/2px;
            }
            h3 {
                width: 90%;
                font-size: 16px;
                padding-top: 8px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            p {
                color: #808080;
                font-size: 12px;
            }
            &.loading{
              height: 55px;
              line-height: 55px;
              text-align: center;
              color: #808080;
              padding-left: 0;
              font-size: 14px;
              background: transparent;
              i{
                display: inline-block;
                margin-right: 6px;
                width: 14px;
                height: 14px;
                border: 1px solid #808080;
                border-top-color: transparent;
                border-radius: 14px;
                position: relative;
                top: 3px;
                animation: loading-ani .8s linear infinite
              }
            }
        }
    }
}
div.history{
  ul{
    li{
      height: 44px;
      padding-left: 56px;
      position: relative;
      background: #fff;
      border-top: 1px solid #ededed;
      i.time-icon{
        position: absolute;
        left: 18px;
        top: (44-20)/2px;
        width: 20px;
        height: 20px;
        background-image: url('../assets/img/clock_ic.png');
        background-repeat: no-repeat;
        background-size: cover;
      }
      h3{
        height: 44px;
        line-height: 44px;
        font-size: 14px;
      }
      i.close{
        position: absolute;
        right: 10px;
        top: 0px;
        width: 44px;
        height: 44px;
        &:before,&:after{
          content: '';
          display: block;
          width: 1px;
          height: 17px;
          background: rgba(0,0,0,.6)
        }
        &:after{
          transform: rotate(45deg);
          margin:-17px 0 0 21.5px
        }
        &:before{
          transform: rotate(-45deg);
          margin: 14.5px 0 0 21.5px
        }
      }
      &.clearHistory{
        text-align: center;
        padding-left: 0;
        line-height: 44px;
        font-size: 12px;
        color: #47c88a;
        border-top: none;
      }
    }
  }
}

@keyframes loading-ani {
  from{transform: rotate(0deg)}
    to{transform: rotate(360deg)}
}
</style>
