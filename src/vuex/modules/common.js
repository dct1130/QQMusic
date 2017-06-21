import * as types from '../types'
// 存储状态值
const state = {
  showWelcome: false, // welcome
  showLoading: false, // loading
  showPlayer: false,  // 播放器
  showToast: false,   // 提示框
  toastHash: '',  // 提示框哈希
  ToastMsg: '',       // 提示框内容
  songList: null        // 歌曲列表
}

const mutations = {
  // welcome
  [types.COM_SHOW_WELCOME] (state, status) {
    state.showWelcome = status
  },
  // loading
  [types.COM_SHOW_LOADING] (state, status) {
    state.showLoading = status
  },
  // 播放器
  [types.COM_SHOW_PLAYER] (state, status) {
    state.showPlayer = status
  },
  // 提示框
  [types.COM_SHOW_TOAST] (state, status) {
    state.showToast = status
    state.toastHash = new Date().getTime()
  },
  // 提示框内容
  [types.COM_TOAST_MSG] (state, msg) {
    state.ToastMsg = msg
  },
  // 歌曲列表
  [types.COM_MUSIC_LIST] (state, obj) {
    state.songList = obj
  }
}

const getters = {
  showWelcome: state => state.showWelcome,
  showLoading: state => state.showLoading,
  showPlayer: state => state.showPlayer,
  showToast: state => state.showToast,
  toastHash: state => state.toastHash,
  ToastMsg: state => state.ToastMsg,
  songList: state => state.songList

}

const actions = {
  // welcome
  setShowWelcome ({
    commit
  }, status) {
    commit(types.COM_SHOW_WELCOME, status)
  },
  // loading
  setShowLoading ({
    commit
  }, status) {
    commit(types.COM_SHOW_LOADING, status)
  },
  // 播放器
  setShowPlayer ({
    commit
  }, status) {
    commit(types.COM_SHOW_PLAYER, status)
  },
  // 提示框
  setShowToast ({
    commit
  }, status) {
    commit(types.COM_SHOW_TOAST, status)
  },
  // 提示框消息
  setToastMsg ({
    commit
  }, msg) {
    commit(types.COM_TOAST_MSG, msg)
  },
  // 歌曲列表
  setMusiclist ({
    commit
  }, obj) {
    commit(types.COM_MUSIC_LIST, obj)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
