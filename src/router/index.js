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
        },
        {
          path: 'resource',
          component: () => import('/src/product/doc/resource.vue')
        },
        {
          path: 'resourcecreator',
          component: () => import('/src/product/doc/resourcecreator.vue')
        },
        {
          path: 'ssl',
          component: () => import('/src/product/doc/ssl.vue')
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
          path: 'account',
          component: () => import('/src/product/updatelog/account.vue')
        },
        {
          path: 'admin',
          component: () => import('/src/product/updatelog/admin.vue')
        },
        {
          path: 'baxk',
          component: () => import('/src/product/updatelog/baxk.vue')
        },
        {
          path: 'aipasswordmemo',
          component: () => import('/src/product/updatelog/aipasswordmemo.vue')
        },
        {
          path: 'synologydsmhelper',
          component: () => import('/src/product/updatelog/synologydsmhelper.vue')
        },
        {
          path: 'homeassistanthelper',
          component: () => import('/src/product/updatelog/homeassistanthelper.vue')
        },
        {
          path: 'webdavhelper',
          component: () => import('/src/product/updatelog/webdavhelper.vue')
        },
        {
          path: 'resource',
          component: () => import('/src/product/updatelog/resource.vue')
        },
        {
          path: 'resourcecreator',
          component: () => import('/src/product/updatelog/resourcecreator.vue')
        },
        {
          path: 'sslweb',
          component: () => import('/src/product/updatelog/sslweb.vue')
        },
        {
          path: 'sslwxxcx',
          component: () => import('/src/product/updatelog/sslwxxcx.vue')
        },
        {
          path: 'tpcl',
          component: () => import('/src/product/updatelog/tpcl.vue')
        },
        {
          path: 'grmpweb',
          component: () => import('/src/product/updatelog/grmpweb.vue')
        },
        {
          path: 'grmpwxxcx',
          component: () => import('/src/product/updatelog/grmpwxxcx.vue')
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
      component: () => import('/src/product/admin/panel.vue')
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
        },
        {
          path: '/product/admin/ssluserlist',
          component: () => import('/src/product/admin/ssluserlist.vue')
        },
        {
          path: '/product/admin/passworduserlist',
          component: () => import('/src/product/admin/passworduserlist.vue')
        },
        {
          path: '/product/admin/newvipcode',
          component: () => import('/src/product/admin/newvipcode.vue')
        },
        {
          path: '/product/admin/vipcodelist',
          component: () => import('/src/product/admin/vipcodelist.vue')
        },
        {
          path: '/product/admin/viploglist',
          component: () => import('/src/product/admin/viploglist.vue')
        },
        {
          path: '/product/admin/pushlist',
          component: () => import('/src/product/admin/pushlist.vue')
        },
        {
          path: '/product/admin/sendpush',
          component: () => import('/src/product/admin/sendpush.vue')
        },
        {
          path: '/product/admin/pushloglist',
          component: () => import('/src/product/admin/pushloglist.vue')
        },
        {
          path: '/product/admin/resourcelist',
          component: () => import('/src/product/admin/resourcelist.vue')
        },
        {
          path: '/product/admin/resourceinfo',
          component: () => import('/src/product/admin/resourceinfo.vue')
        },
        {
          path: '/product/admin/updateresource',
          component: () => import('/src/product/admin/updateresource.vue')
        },
        {
          path: '/product/admin/reviewresource',
          component: () => import('/src/product/admin/reviewresource.vue')
        },
        {
          path: '/product/admin/sslnewlimitchange',
          component: () => import('/src/product/admin/sslnewlimitchange.vue')
        },
        {
          path: '/product/admin/ssllimitchangelist',
          component: () => import('/src/product/admin/ssllimitchangelist.vue')
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
    },
    {
      path: '/product/resource',
      component: () => import('/src/product/resource/container.vue'),
      children: [
        {
          path: '',
          component: () => import('/src/product/resource/index.vue')
        },
        {
          path: 'index',
          component: () => import('/src/product/resource/index.vue')
        },
        {
          path: 'search',
          component: () => import('/src/product/resource/search.vue')
        },
        {
          path: 'info',
          component: () => import('/src/product/resource/info.vue')
        },
        {
          path: 'panel',
          component: () => import('/src/product/resource/panel.vue'),
          children: [
            {
              path: '/product/resource/addlist',
              component: () => import('/src/product/resource/addlist.vue')
            },
            {
              path: '/product/resource/notice',
              component: () => import('/src/product/resource/notice.vue')
            },
            {
              path: '/product/resource/setting',
              component: () => import('/src/product/resource/setting.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/product/resourcecreator',
      component: () => import('/src/product/resourcecreator/panel.vue')
    },
    {
      path: '/product/resourcecreator/panel',
      component: () => import('/src/product/resourcecreator/panel.vue'),
      children: [
        {
          path: '/product/resourcecreator/newresource',
          component: () => import('/src/product/resourcecreator/newresource.vue')
        },
        {
          path: '/product/resourcecreator/newresourceeasy',
          component: () => import('/src/product/resourcecreator/newresourceeasy.vue')
        },
        {
          path: '/product/resourcecreator/resourcelist',
          component: () => import('/src/product/resourcecreator/resourcelist.vue')
        },
        {
          path: '/product/resourcecreator/resourceinfo',
          component: () => import('/src/product/resourcecreator/resourceinfo.vue')
        },
        {
          path: '/product/resourcecreator/updateresource',
          component: () => import('/src/product/resourcecreator/updateresource.vue')
        },
        {
          path: '/product/resourcecreator/notice',
          component: () => import('/src/product/resourcecreator/notice.vue')
        }
      ]
    },
    {
      path: '/product/ssl',
      component: () => import('/src/product/ssl/panel.vue')
    },
    {
      path: '/product/ssl/panel',
      component: () => import('/src/product/ssl/panel.vue'),
      children: [
        {
          path: '/product/ssl/limit',
          component: () => import('/src/product/ssl/limit.vue')
        },
        {
          path: '/product/ssl/acmeaccount',
          component: () => import('/src/product/ssl/acmeaccount.vue')
        },
        {
          path: '/product/ssl/neworder',
          component: () => import('/src/product/ssl/neworder.vue')
        },
        {
          path: '/product/ssl/orderlist',
          component: () => import('/src/product/ssl/orderlist.vue')
        },
        {
          path: '/product/ssl/orderinfo',
          component: () => import('/src/product/ssl/orderinfo.vue')
        },
        {
          path: '/product/ssl/authorization',
          component: () => import('/src/product/ssl/authorization.vue')
        },
        {
          path: '/product/ssl/dnstask',
          component: () => import('/src/product/ssl/dnstask.vue')
        },
        {
          path: '/product/ssl/newtemplate',
          component: () => import('/src/product/ssl/newtemplate.vue')
        },
        {
          path: '/product/ssl/templatelist',
          component: () => import('/src/product/ssl/templatelist.vue')
        },
        {
          path: '/product/ssl/updatetemplate',
          component: () => import('/src/product/ssl/updatetemplate.vue')
        },
        {
          path: '/product/ssl/notice',
          component: () => import('/src/product/ssl/notice.vue')
        },
        {
          path: '/product/ssl/setting',
          component: () => import('/src/product/ssl/setting.vue')
        }
      ]
    }
  ]
})
export default router