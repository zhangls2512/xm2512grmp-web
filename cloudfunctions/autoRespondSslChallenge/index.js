'use strict'
exports.main = async () => {
  const tcb = require('@cloudbase/node-sdk')
  const acme = require('nodejs-acmeclient')
  const app = tcb.init()
  const db = app.database()
  const res = await db.collection('dnstask').where({
    status: 'submitpending'
  }).orderBy('updateDate', 'asc').get()
  res.data.forEach(async (item) => {
    const userres = await db.collection('productuser').where({
      product: 'ssl',
      uid: item.uid
    }).get()
    const setting = userres.data[0].setting.autoSubmitChallengeVerify
    if (setting == 'close') {
      await db.collection('dnstask').where({
        _id: item._id
      }).update({
        status: 'autoend',
        updateDate: Date.now()
      })
      app.callFunction({
        name: 'sendEmail',
        data: {
          uid: item.uid,
          noticeName: 'ssl_email_autodnstaskstatuschange',
          subject: 'SSL证书DNS自动配置任务状态变更通知',
          text: '您的账号SSL证书产品DNS自动配置任务（ID：' + item._id + '）状态已变更为自动结束。'
        }
      })
      app.callFunction({
        name: 'sendWebhook',
        data: {
          uid: item.uid,
          data: {
            noticeName: 'ssl_webhook_autodnstaskstatuschange',
            dnstaskId: item._id,
            status: 'autoend'
          }
        }
      })
    }
    if (setting == 'direct') {
      const challengeurl = item.authorization.challenges.find(item => item.type == 'dns-01').url
      try {
        await acme.api.respondChallenge({
          directoryUrl: item.directoryUrl,
          accountKey: item.accountKey,
          challengeUrl: challengeurl
        })
      } catch (err) {
        await db.collection('dnstask').where({
          _id: item._id
        }).update({
          error: err.detail,
          status: 'submitfail',
          updateDate: Date.now()
        })
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: item.uid,
            noticeName: 'ssl_email_autodnstaskstatuschange',
            subject: 'SSL证书DNS自动配置任务状态变更通知',
            text: '您的账号SSL证书产品DNS自动配置任务（ID：' + item._id + '）状态已变更为提交挑战验证失败。'
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: item.uid,
            data: {
              noticeName: 'ssl_webhook_autodnstaskstatuschange',
              dnstaskId: item._id,
              status: 'submitfail',
              error: err.detail
            }
          }
        })
      }
      await db.collection('dnstask').where({
        _id: item._id
      }).update({
        status: 'submitsuccess',
        updateDate: Date.now()
      })
      app.callFunction({
        name: 'sendEmail',
        data: {
          uid: item.uid,
          noticeName: 'ssl_email_autodnstaskstatuschange',
          subject: 'SSL证书DNS自动配置任务状态变更通知',
          text: '您的账号SSL证书产品DNS自动配置任务（ID：' + item._id + '）状态已变更为已提交挑战验证。'
        }
      })
      app.callFunction({
        name: 'sendWebhook',
        data: {
          uid: item.uid,
          data: {
            noticeName: 'ssl_webhook_autodnstaskstatuschange',
            dnstaskId: item._id,
            status: 'submitsuccess'
          }
        }
      })
    }
    if (setting == 'afterverify') {
      const verifyres = await acme.verify.verify({
        authorization: item.authorization,
        accountKey: item.accountKey,
        type: 'dns-01'
      })
      if (verifyres == 'success') {
        const challengeurl = item.authorization.challenges.find(item => item.type == 'dns-01').url
        try {
          await acme.api.respondChallenge({
            directoryUrl: item.directoryUrl,
            accountKey: item.accountKey,
            challengeUrl: challengeurl
          })
        } catch (err) {
          await db.collection('dnstask').where({
            _id: item._id
          }).update({
            error: err.detail,
            status: 'submitfail',
            updateDate: Date.now()
          })
          app.callFunction({
            name: 'sendEmail',
            data: {
              uid: item.uid,
              noticeName: 'ssl_email_autodnstaskstatuschange',
              subject: 'SSL证书DNS自动配置任务状态变更通知',
              text: '您的账号SSL证书产品DNS自动配置任务（ID：' + item._id + '）状态已变更为提交挑战验证失败。'
            }
          })
          app.callFunction({
            name: 'sendWebhook',
            data: {
              uid: item.uid,
              data: {
                noticeName: 'ssl_webhook_autodnstaskstatuschange',
                dnstaskId: item._id,
                status: 'submitfail',
                error: err.detail
              }
            }
          })
        }
        await db.collection('dnstask').where({
          _id: item._id
        }).update({
          status: 'submitsuccess',
          updateDate: Date.now()
        })
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: item.uid,
            noticeName: 'ssl_email_autodnstaskstatuschange',
            subject: 'SSL证书DNS自动配置任务状态变更通知',
            text: '您的账号SSL证书产品DNS自动配置任务（ID：' + item._id + '）状态已变更为已提交挑战验证。'
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: item.uid,
            data: {
              noticeName: 'ssl_webhook_autodnstaskstatuschange',
              dnstaskId: item._id,
              status: 'submitsuccess'
            }
          }
        })
      }
    }
  })
}