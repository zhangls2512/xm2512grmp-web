import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '',
      component: () => import('/src/index.vue')
    },
    {
      path: '/index',
      component: () => import('/src/product/index.vue')
    },
    {
      path: '/product',
      component: () => import('/src/product/index.vue')
    },
    {
      path: '/product/index',
      component: () => import('/src/product/index.vue')
    },
    {
      path: '/product/doc',
      component: () => import('/src/product/doc/container.vue'),
      children: [
        {
          path: 'baxk',
          component: () => import('/src/product/doc/baxk.vue')
        }
      ]
    },
    {
      path: '/product/updatelog',
      component: () => import('/src/product/updatelog/container.vue'),
      children: [
        {
          path: 'index',
          component: () => import('/src/product/updatelog/index.vue')
        },
        {
          path: 'baxk',
          component: () => import('/src/product/updatelog/baxk.vue')
        },
        {
          path: 'account',
          component: () => import('/src/product/updatelog/account.vue')
        },
        {
          path: 'admin',
          component: () => import('/src/product/updatelog/admin.vue')
        },
        {
          path: 'grmpweb',
          component: () => import('/src/product/updatelog/grmpweb.vue')
        }
      ]
    },
    {
      path: '/product/account',
      component: () => import('/src/product/account/container.vue'),
      children: [
        {
          path: '',
          component: () => import('/src/product/account/login.vue')
        },
        {
          path: 'login',
          component: () => import('/src/product/account/login.vue')
        },
        {
          path: 'register',
          component: () => import('/src/product/account/register.vue')
        },
        {
          path: 'unfreeze',
          component: () => import('/src/product/account/unfreeze.vue')
        },
        {
          path: 'panel',
          component: () => import('/src/product/account/panel.vue'),
          children: [
            {
              path: '/product/account/info',
              component: () => import('/src/product/account/info.vue')
            },
            {
              path: '/product/account/loginlog',
              component: () => import('/src/product/account/loginlog.vue')
            },
            {
              path: '/product/account/develop',
              component: () => import('/src/product/account/develop.vue')
            },
            {
              path: '/product/account/product',
              component: () => import('/src/product/account/product.vue')
            },
            {
              path: '/product/account/notice',
              component: () => import('/src/product/account/notice.vue')
            },
            {
              path: '/product/account/banlog',
              component: () => import('/src/product/account/banlog.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/product/admin',
      component: () => import('/src/product/admin/panel.vue'),
    },
    {
      path: '/product/admin/panel',
      component: () => import('/src/product/admin/panel.vue'),
      children: [
        {
          path: '/product/admin/notice',
          component: () => import('/src/product/admin/notice.vue')
        },
        {
          path: '/product/admin/userlist',
          component: () => import('/src/product/admin/userlist.vue')
        },
        {
          path: '/product/admin/newbanlog',
          component: () => import('/src/product/admin/newbanlog.vue')
        },
        {
          path: '/product/admin/banloglist',
          component: () => import('/src/product/admin/banloglist.vue')
        },
        {
          path: '/product/admin/newbaxk',
          component: () => import('/src/product/admin/newbaxk.vue')
        },
        {
          path: '/product/admin/baxklist',
          component: () => import('/src/product/admin/baxklist.vue')
        }
      ]
    },
    {
      path: '/product/baxk',
      component: () => import('/src/product/baxk/jqcx.vue')
    },
    {
      path: '/product/baxk/jqcx',
      component: () => import('/src/product/baxk/jqcx.vue')
    }
  ]
})
export default router