import axios from 'axios'
// axios 配置
axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = 'https://c.y.qq.com/'
const api = {
  home: 'musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1494577685377',
  rank: 'v8/fcg-bin/fcg_myqq_toplist.fcg?format=json&g_tk=5381&uin=0&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1494579063393',
  hotWords: 'splcloud/fcgi-bin/gethotkey.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1494818667377',
  searchKey: 'soso/fcgi-bin/search_for_qq_cp?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&zhidaqu=1&catZhida=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&perpage=20&n=20&remoteplace=txt.mqq.all',
  songsheet: 'qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&new_format=1&pic=500&type=1&json=1&utf8=1&onlysong=0&nosign=1',
  ranksheet: 'v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top',
  musicid: 'v8/fcg-bin/fcg_v8_radiosonglist.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1496908637661',
  musiclist: 'v8/playsong.html',
  lyric: 'http://route.showapi.com/213-2'
}

export function fetchGet (url, param) {
  return new Promise((resolve, reject) => {
    axios.get(url, {params: param})
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default {
  /* 首页数据 */
  getRecommend () {
    return fetchGet(api.home)
  },
  /* 排行榜 */
  getRank () {
    return fetchGet(api.rank)
  },
  /* 获取热门词 */
  getHotWords () {
    return fetchGet(api.hotWords)
  },
  /* 搜索 */
  getSearch (param) {
    return fetchGet(api.searchKey, param)
  },
  /* 歌单 */
  getSongSheet (param) {
    return fetchGet(api.songsheet, param)
  },
  /* 排行版歌单 */
  getRankSheet (param) {
    return fetchGet(api.ranksheet, param)
  },
  // 获取歌曲id
  getMusicId (param) {
    return fetchGet(api.musicid, param)
  },
  /* 获取歌曲 */
  getMusicList (param) {
    return fetchGet(api.musiclist, param)
  },
  /* 获取歌词 */
  getLyric (param) {
    return fetchGet(api.lyric, param)
  }
}
