'use strict'
exports.main = async () => {
  const Alidns20150109 = require('@alicloud/alidns20150109')
  const OpenApi = require('@alicloud/openapi-client')
  const Util = require('@alicloud/tea-util')
  const tcb = require('@cloudbase/node-sdk')
  const acme = require('nodejs-acmeclient')
  const tencentcloud = require('tencentcloud-sdk-nodejs')
  const dnspod = tencentcloud.dnspod.v20210323
  const app = tcb.init()
  const db = app.database()
  const res = await db.collection('dnstask').where({
    status: 'setpending'
  }).orderBy('updateDate', 'asc').get()
  const uniquemap = new Map()
  res.data.forEach(item => {
    if (!uniquemap.has(item.domain)) {
      uniquemap.set(item.domain, item)
    }
  })
  const uniquearray = Array.from(uniquemap.values())
  uniquearray.forEach(async (item) => {
    const countres = await db.collection('dnstask').where({
      domain: item.domain,
      status: 'submitpending'
    }).count()
    if (countres.total > 0) {
      return
    }
    const challenge = item.authorization.challenges.find(item => item.type = 'dns-01')
    const value = acme.api.getChallengeKeyAuthorization({
      challenge: challenge,
      accountKey: item.accountKey
    })
    let enddomain = ''
    item.dnsConfig.domains.forEach(domainsitem => {
      if (item.domain.endsWith(domainsitem)) {
        if (!enddomain) {
          enddomain = domainsitem
        }
      }
    })
    const left = item.domain.slice(0, -(enddomain.length + 1))
    let subdomain = ''
    if (left.length == 0) {
      subdomain = '_acme-challenge'
    } else {
      subdomain = '_acme-challenge.' + left
    }
    if (item.dnsConfig.platform == 'aliyun') {
      const config = new OpenApi.Config({
        accessKeyId: item.dnsConfig.keyId,
        accessKeySecret: item.dnsConfig.keySecret
      })
      const client = new Alidns20150109.default(config)
      try {
        const describedomainrecordsrequest = new Alidns20150109.DescribeDomainRecordsRequest({
          domainName: enddomain,
          keyWord: subdomain,
          type: 'TXT'
        })
        const runtime = new Util.RuntimeOptions({})
        const describedomainrecordsres = await client.describeDomainRecordsWithOptions(describedomainrecordsrequest, runtime)
        const record = describedomainrecordsres.body.domainRecords.record[0]
        if (record) {
          const recordid = record.recordId
          const updatedomainrecordrequest = new Alidns20150109.UpdateDomainRecordRequest({
            recordId: recordid,
            RR: subdomain,
            type: 'TXT',
            value: value
          })
          await client.updateDomainRecord(updatedomainrecordrequest, runtime)
          const updatedomainrecordremarkwithoptionsrequest = new Alidns20150109.UpdateDomainRecordRemarkRequest({
            recordId: recordid,
            remark: '轩铭2512SSL证书产品DNS自动配置任务'
          })
          await client.updateDomainRecordRemarkWithOptions(updatedomainrecordremarkwithoptionsrequest, runtime)
          const setdomainrecordstatuswithoptionsrequest = new Alidns20150109.SetDomainRecordStatusRequest({
            recordId: recordid,
            status: 'Enable'
          })
          await client.setDomainRecordStatusWithOptions(setdomainrecordstatuswithoptionsrequest, runtime)
        } else {
          const adddomainrecordrequest = new Alidns20150109.AddDomainRecordRequest({
            domainName: enddomain,
            RR: subdomain,
            type: 'TXT',
            value: value
          })
          const adddomainrecordres = await client.addDomainRecordWithOptions(adddomainrecordrequest, runtime)
          const recordid = adddomainrecordres.body.recordId
          const updatedomainrecordremarkwithoptionsrequest = new Alidns20150109.UpdateDomainRecordRemarkRequest({
            recordId: recordid,
            remark: '轩铭2512SSL证书产品DNS自动配置任务'
          })
          await client.updateDomainRecordRemarkWithOptions(updatedomainrecordremarkwithoptionsrequest, runtime)
          const setdomainrecordstatuswithoptionsrequest = new Alidns20150109.SetDomainRecordStatusRequest({
            recordId: recordid,
            status: 'Enable'
          })
          await client.setDomainRecordStatusWithOptions(setdomainrecordstatuswithoptionsrequest, runtime)
        }
        await db.collection('dnstask').where({
          _id: item._id
        }).update({
          status: 'submitpending',
          updateDate: Date.now()
        })
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: item.uid,
            noticeName: 'ssl_email_autodnstaskstatuschange',
            subject: 'SSL证书DNS自动配置任务状态变更通知',
            text: '您的账号SSL证书产品DNS自动配置任务（ID：' + item._id + '）状态已变更为待提交挑战验证。'
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: item.uid,
            data: {
              noticeName: 'ssl_webhook_autodnstaskstatuschange',
              dnstaskId: item._id,
              status: 'submitpending'
            }
          }
        })
      } catch (err) {
        await db.collection('dnstask').where({
          _id: item._id
        }).update({
          error: err.code,
          status: 'setfail',
          updateDate: Date.now()
        })
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: item.uid,
            noticeName: 'ssl_email_autodnstaskstatuschange',
            subject: 'SSL证书DNS自动配置任务状态变更通知',
            text: '您的账号SSL证书产品DNS自动配置任务（ID：' + item._id + '）状态已变更为配置解析记录失败。'
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: item.uid,
            data: {
              noticeName: 'ssl_webhook_autodnstaskstatuschange',
              dnstaskId: item._id,
              status: 'setfail',
              error: err.code
            }
          }
        })
      }
    }
    if (item.dnsConfig.platform == 'tencentcloud') {
      const client = new dnspod.Client({
        credential: {
          secretId: item.dnsConfig.keyId,
          secretKey: item.dnsConfig.keySecret
        }
      })
      try {
        const tencentcloudrecordlistres = await client.DescribeRecordFilterList({
          Domain: enddomain,
          SubDomain: subdomain,
          IsExactSubDomain: true
        })
        const tencentcloudrecord = tencentcloudrecordlistres.RecordList.find(item => item.Type == 'TXT')
        if (tencentcloudrecord) {
          await client.ModifyRecord({
            RecordId: tencentcloudrecord.RecordId,
            Domain: enddomain,
            SubDomain: subdomain,
            RecordType: 'TXT',
            RecordLine: '默认',
            Value: value,
            Status: 'ENABLE',
            Remark: '轩铭2512SSL证书产品DNS自动配置任务'
          })
        } else {
          await client.CreateRecord({
            Domain: enddomain,
            SubDomain: subdomain,
            RecordType: 'TXT',
            RecordLine: '默认',
            Value: value,
            Status: 'ENABLE',
            Remark: '轩铭2512SSL证书产品DNS自动配置任务'
          })
        }
        await db.collection('dnstask').where({
          _id: item._id
        }).update({
          status: 'submitpending',
          updateDate: Date.now()
        })
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: item.uid,
            noticeName: 'ssl_email_autodnstaskstatuschange',
            subject: 'SSL证书DNS自动配置任务状态变更通知',
            text: '您的账号SSL证书产品DNS自动配置任务（ID：' + item._id + '）状态已变更为待提交挑战验证。'
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: item.uid,
            data: {
              noticeName: 'ssl_webhook_autodnstaskstatuschange',
              dnstaskId: item._id,
              status: 'submitpending'
            }
          }
        })
      } catch (err) {
        await db.collection('dnstask').where({
          _id: item._id
        }).update({
          error: err.code,
          status: 'setfail',
          updateDate: Date.now()
        })
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: item.uid,
            noticeName: 'ssl_email_autodnstaskstatuschange',
            subject: 'SSL证书DNS自动配置任务状态变更通知',
            text: '您的账号SSL证书产品DNS自动配置任务（ID：' + item._id + '）状态已变更为配置解析记录失败。'
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: item.uid,
            data: {
              noticeName: 'ssl_webhook_autodnstaskstatuschange',
              dnstaskId: item._id,
              status: 'setfail',
              error: err.code
            }
          }
        })
      }
    }
  })
}