import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import Recom from '@/pages/recom'
import Rank from '@/pages/rank'
import Search from '@/pages/search'
import SongSheet from '@/pages/songsheet'
import Player from '@/pages/player'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/recom'
    },
    {
      path: '/',
      name: 'index',
      component: index,
      children: [
        {
          path: '/recom',
          component: Recom
        },
        {
          path: '/rank',
          component: Rank
        },
        {
          path: '/search',
          component: Search
        }
      ]
    },
    {
      path: '/songsheet/:id/:type',
      name: 'SongSheet',
      component: SongSheet
    },
    {
      path: '/player/:id',
      name: 'Player',
      component: Player
    }
  ]
})
