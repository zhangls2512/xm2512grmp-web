<script setup>
document.title = '轩铭2512 - 更新日志 - 密码智能备忘录'
const data = [
  {
    versionNumber: '2.0.2.2',
    releaseDate: '2025-09-27',
    logs: [
      {
        type: 'A',
        content: '账号支持绑定通行密钥、使用通行密钥登录（此功能目前无法使用，为能力预埋）'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 账号 新增 通用密钥静默登录（此功能目前无法使用，为能力预埋）'
      },
      {
        type: 'U',
        content: '云服务、会员中心入口移至 我的'
      },
      {
        type: 'U',
        content: '“网络测试”页面优化，新增“请求地址”，下线值为 NaN 的属性，修改“请求总耗时”数据计算方式使其符合实际'
      }
    ]
  },
  {
    versionNumber: '2.0.2.1',
    releaseDate: '2025-09-24',
    logs: [
      {
        type: 'A',
        content: '新增、修改标签弹窗中新增调色器'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 通用 - 通用 - 界面 新增 密码信息内容、标签输入框失焦时自动添加信息、标签'
      },
      {
        type: 'U',
        content: '“密码”“常用信息”“标签”顶部文字按钮改为图标按钮'
      },
      {
        type: 'U',
        content: '新增、修改、筛选密码弹窗的高度恢复为自适应（测试发现高度固定为高时也可能会出现弹窗底部按钮下方出现较大但错误的间距，未达到调整目的，因此恢复）'
      },
      {
        type: 'U',
        content: '“常用信息”顶部“AI 识别新增”按钮添加彩色双边流光效果'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 通用 - 通用 - 界面 - 常用信息类型默认值调整，新增、修改密码弹窗为“密码”“MFA”“图标”，筛选密码、新增常用信息弹窗为“密码”“图标”'
      },
      {
        type: 'U',
        content: '功能下线：应用资源限制设置（原因：功能未实际生效）'
      },
      {
        type: 'F',
        content: '新增、修改密码弹窗中点击“扫码添加”按钮后未扫码直接关闭扫码界面时会报错'
      },
      {
        type: 'F',
        content: '新增、修改密码弹窗中“自动新增常用信息”未过滤“MFA”类型'
      },
      {
        type: 'F',
        content: '筛选密码弹窗中选择 / 输入的信息类型为“MFA”时不显示信息内容输入框'
      },
      {
        type: 'F',
        content: '新增、修改、筛选密码，新增常用信息弹窗中在信息类型选择器（Select 组件）选择信息类型时可能未生效'
      },
      {
        type: 'F',
        content: '常用信息 - AI 识别新增 - 图片识别 - 拍照、从图库中选择未拍照、选择图片直接关闭界面时会报错'
      },
      {
        type: 'F',
        content: '我的 - 设置 - 账号 - 会员中心 - 开通记录 - 申请退款未提交退款申请直接关闭界面时会报错'
      },
      {
        type: 'F',
        content: '进入“故障日志”页面时如果无故障日志会报错'
      },
      {
        type: 'F',
        content: '因数据已存在导致新增、修改常用信息、标签失败时会报错'
      },
      {
        type: 'F',
        content: '手动关闭通知权限后，应用冷启动时会报错'
      }
    ]
  },
  {
    versionNumber: '2.0.2.0',
    releaseDate: '2025-09-22',
    logs: [
      {
        type: 'A',
        content: '新增、修改密码弹窗中新增“自动新增常用信息（MFA 类型除外）、标签”开关'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 通用 - 通用 - 界面 新增 常用信息类型、默认隐藏内容密码信息类型、密码信息内容特殊实体识别'
      },
      {
        type: 'A',
        content: '我的 - 密码安全检查 新增 近一年未修改'
      },
      {
        type: 'A',
        content: '卡片支持添加到锁屏界面'
      },
      {
        type: 'U',
        content: '“密码”中显示的密码支持选中以方便复制（我的 - 设置 - 通用 - 通用 - 界面 - 首页显示密码开启时）'
      },
      {
        type: 'U',
        content: '“密码详情”弹窗中“MFA”类型信息支持长按复制其的 otpauthUri 字符串（点击复制的是数字）'
      },
      {
        type: 'U',
        content: '新增、修改、筛选密码弹窗中不推荐已添加的常用信息、标签'
      },
      {
        type: 'U',
        content: '新增、修改密码弹窗中“密码”类型信息内容输入框左上角新增“随机生成”按钮，点击可拉起“密码随机生成”页面生成并一键填入随机生成的密码、“MFA”类型信息支持输入 otpauthUri 添加'
      },
      {
        type: 'U',
        content: '“常用信息”长按（鼠标右键）菜单新增“复制”（“图标”类型为“保存”）'
      },
      {
        type: 'U',
        content: '常用信息类型新增“图标”，新增、修改、筛选密码时恢复推荐“图标”类型常用信息'
      },
      {
        type: 'U',
        content: '应用服务模式为“基本模式”时我的 - 设置页面刷新不执行需网环节'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 数据 - 导入与导出 - 导出 - 密码新增 csv 格式'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 通用 - 通用 - 应用 新增 防窥保护（点击跳转到系统设置 - 隐私和安全页面。如果系统支持防窥保护功能，会在页面中的“私密防护”分类下显示“防窥保护”设置入口，点击进入“防窥保护”设置页面，在页面中开启本应用右侧的开关即可）'
      },
      {
        type: 'U',
        content: '调试设置 - 保存故障日志、自动上传故障日志类型 新增 js 执行异常'
      },
      {
        type: 'U',
        content: '优化密码名称、信息类型、信息内容（图标、MFA 类型除外）、标签，常用信息类型、内容，标签文本的中英文间距'
      },
      {
        type: 'U',
        content: '优化底部导航栏（Tab 组件），可以通过滑动上方页面进行页面切换、背后变模糊并叠加在上方页面之上（仅手机端可用）'
      },
      {
        type: 'U',
        content: '精简部分页面的 UI 组件节点数，提升布局性能'
      },
      {
        type: 'U',
        content: '优化卡片中的图标，提升其清晰度、改变其颜色'
      },
      {
        type: 'F',
        content: '常用信息 - AI 识别新增待识别文本为空时可能会报错'
      },
      {
        type: 'F',
        content: '应用服务模式为“基本模式”时我的 - 设置 - 云备份 - 导入 - 手动因为无法联网实际上导入失败却弹窗提示“导入成功”'
      },
      {
        type: 'F',
        content: '我的 - 设置 - 通用 - 通用 - 应用 - 图标模式设置为“自动”“浅色”时可能会报错'
      },
      {
        type: 'F',
        content: '新增、修改、筛选密码弹窗中选择“MFA”类型时未清空推荐的常用信息'
      },
      {
        type: 'F',
        content: '删除常用信息、标签时报错并删除失败'
      },
      {
        type: 'F',
        content: '清理邀请二维码图片缓存、故障日志、旧账号数据、无用密码图标图片时可能会报错'
      },
      {
        type: 'F',
        content: '退出“更多设置”页面后不应刷新“设置”页面'
      },
      {
        type: 'F',
        content: '关闭“清理数据”页面后未刷新“设置”页面'
      },
      {
        type: 'F',
        content: '关闭模态弹窗（Dialog）、操作菜单（ActionMenu），点击操作菜单（ActionMenu）底部的“取消”后会报错'
      },
      {
        type: 'F',
        content: '应用冷启动前从系统非桌面入口进入应用时可能未拉起对应页面（目前无法复现，不知原因）'
      },
      {
        type: 'F',
        content: '卡片名称、描述错误为应用名称（正常应符合卡片功能）'
      },
      {
        type: 'F',
        content: '已知问题：新增、修改、筛选密码，新增常用信息弹窗中在信息类型选择器（Select 组件）选择信息类型时可能未生效（偶发，原因目前初步定为事件竞争，正在寻找修复方案，遇到此问题的可反复选择重试）'
      }
    ]
  },
  {
    versionNumber: '2.0.1.2',
    releaseDate: '2025-09-18',
    logs: [
      {
        type: 'U',
        content: '我的 - 设置 - 账号 - 会员中心 - 邀请新用户，免费得会员中显示邀请二维码图片'
      },
      {
        type: 'U',
        content: '透明按钮添加柔和点光源效果'
      },
      {
        type: 'U',
        content: '修改 AppLinking 快速使用邀请码、兑换码结果弹窗样式'
      },
      {
        type: 'F',
        content: '常用信息、标签下拉刷新时在显示列表的地方显示加载动画（正常情况为仅在页面顶部显示加载动画）'
      },
      {
        type: 'F',
        content: '我的 - UID、登录到期时间深色模式下背景颜色不正确'
      },
      {
        type: 'F',
        content: '我的 - 设置 - 账号 - 会员中心 - 邀请新用户，免费得会员点击分享的邀请链接中无邀请码仅有邀请链接固定前缀、“邀请二维码”文本未加粗'
      },
      {
        type: 'F',
        content: '我的 - 设置 - 通用 - 通用 - 界面 - 窗口置顶不应在手机上显示、生效设置'
      },
      {
        type: 'F',
        content: '我的 - 设置 - 关于 - 智能客服按钮未水平居中'
      },
      {
        type: 'F',
        content: '调试设置 - 基础 - 故障展示方式、自动上传故障日志类型需重启应用才能生效（正常情况为无需重启即可生效）'
      },
      {
        type: 'F',
        content: '调试设置 - 基础 - 资源限制 应为 应用资源限制'
      },
      {
        type: 'F',
        content: '评论应用功能未生效（临时降级为跳转应用市场，待应用内评论弹窗功能正常可用后恢复）'
      },
      {
        type: 'F',
        content: '“清理数据”页面深色模式下背景颜色不正确'
      },
      {
        type: 'F',
        content: '部分场景下（取消）禁止截、录屏未执行完毕就进入 / 退出了页面'
      },
      {
        type: 'F',
        content: '修改部分页面路径文本描述至符合当前版本实际'
      },
      {
        type: 'F',
        content: '我的 - 设置 - 通用 - 通用 - 应用 - 图标模式设置为“自动”“浅色”后应用冷启动时可能会报错'
      },
      {
        type: 'F',
        content: '应用热启动时未跟随我的 - 设置 - 通用 - 通用 - 应用 - 图标模式”设置自动切换图标深浅色模式'
      },
      {
        type: 'F',
        content: '已知问题：调试设置 - 基础 - 资源限制功能未生效'
      }
    ]
  },
  {
    versionNumber: '2.0.1.1',
    releaseDate: '2025-09-16',
    logs: [
      {
        type: 'U',
        content: '密码详情弹窗中非“图标”“MFA”“URL”类型信息内容支持长按复制粘贴、识别其中的特殊实体（包括但不限于 URL）'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 账号 新增 账号中心'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 云备份 - 密钥 新增“建议复制、备份密钥”文字提示'
      },
      {
        type: 'U',
        content: '依次点击系统设置 - 存储 - 轩铭密码智能备忘录 - 前往清理数据可拉起“清理数据”页面（以前仅弹窗告知页面路径）'
      },
      {
        type: 'F',
        content: '新增、修改、筛选密码时不应推荐类型为“图标”“MFA”的常用信息'
      },
      {
        type: 'F',
        content: '已知问题：应用冷启动前从系统非桌面入口进入应用时可能未拉起对应页面'
      }
    ]
  },
  {
    versionNumber: '2.0.1.0',
    releaseDate: '2025-09-15',
    logs: [
      {
        type: 'U',
        content: '新增、修改密码弹窗中“图标”“MFA”类型信息显示方式用户友好化'
      },
      {
        type: 'U',
        content: '新增、修改密码弹窗中“图标”类型信息选择图片成功后不禁用“信息类型”选择器'
      },
      {
        type: 'U',
        content: '允许删除有“图标”类型信息的密码'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 更多 - 其他 - 清理数据 新增 邀请二维码图片缓存、无用数据'
      },
      {
        type: 'U',
        content: '“跳转链接”类型通知支持跳转浏览器'
      },
      {
        type: 'F',
        content: '新增、修改密码弹窗中信息选择“图标”类型时未清空“信息内容”输入框'
      }
    ]
  },
  {
    versionNumber: '2.0.0.0',
    releaseDate: '2025-09-13',
    logs: [
      {
        type: 'A',
        content: '密码 新增搜索框'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 账号 新增 设备间同步、华为账号静默登录'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 账号 - 会员中心 新增 邀请新用户，免费得会员，支持邀请码、邀请链接、邀请二维码、碰一碰、隔空传送五种邀请方式'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 云备份 - 导入 新增 自动'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 数据 - 导入与导出 新增 导入第三方密码'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 通用升级，新增 卡片、多个设置项'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 消息通知升级，新增通知位列表'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 更多 - 其他 - 清除设置数据 升级为 清理数据'
      },
      {
        type: 'U',
        content: '修改新增、修改、筛选密码弹窗的高度'
      },
      {
        type: 'U',
        content: '单击（鼠标左键）：密码详情；常用信息、标签修改'
      },
      {
        type: 'U',
        content: '长按（鼠标右键）：密码修改；密码、常用信息、标签删除、云备份、删除云备份'
      },
      {
        type: 'U',
        content: '密码信息、标签支持上、下移'
      },
      {
        type: 'U',
        content: '密码信息新增 图标 类型'
      },
      {
        type: 'U',
        content: '密码 URL 类型信息点击弹出菜单：打开、复制'
      },
      {
        type: 'U',
        content: '常用信息 - AI 识别新增 - 图片识别 新增 从其他设备导入'
      },
      {
        type: 'U',
        content: '我的 新增 UID、登录到期时间（登录轩铭 2512 统一账号时可见）'
      },
      {
        type: 'U',
        content: '账号已绑定华为账号时我的 - 设置 - 账号中显示 解绑华为账号'
      },
      {
        type: 'U',
        content: '兑换码获取方式支持点击跳转'
      },
      {
        type: 'U',
        content: '提高了导入云备份的效率'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 数据 - 设备间同步 - 可信设备 新增 刷新'
      },
      {
        type: 'U',
        content: '修改故障日志自动上传成功、设备间数据同步失败弹窗文本'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 数据 - 导入与导出支持导入标准格式的密码 csv 文件'
      },
      {
        type: 'U',
        content: '修改清除设置数据逻辑'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 关于 新增 使用教程、智能客服'
      },
      {
        type: 'U',
        content: '客服新增 QQ 群'
      },
      {
        type: 'U',
        content: '调试 拆分成 调试设置、调试信息，并新增一些调试设置（调试信息暂时下线，计划在鸿蒙 6 消费者版本推送后恢复）'
      },
      {
        type: 'U',
        content: '密码、常用信息、标签页面支持下拉刷新'
      },
      {
        type: 'U',
        content: '进入新增密码、新增常用信息、新增标签、恶意 URL 检测、意见反馈页面时最上方输入框自动获焦'
      },
      {
        type: 'U',
        content: '优化新增密码、修改密码、筛选密码、恶意 URL 检测等页面，使内容在阔折叠设备的折叠态时完整显示'
      },
      {
        type: 'U',
        content: '云备份状态按账号粒度保存'
      },
      {
        type: 'U',
        content: '非手机上导航栏改为纵向'
      },
      {
        type: 'U',
        content: '优化文本（仅限 Text 组件中的）、输入框（TextInput、TextArea 组件）中英文间距'
      },
      {
        type: 'U',
        content: 'MFA、邮箱验证码输入框改为验证码类型'
      },
      {
        type: 'U',
        content: '部分类型输入框接入系统智能填充能力，系统会使用历史表单输入作为填充建议（依次点击系统设置 - 隐私和安全 - 智能填充）'
      },
      {
        type: 'U',
        content: '菜单（Menu 组件）弹出时振动效果跟随系统'
      },
      {
        type: 'U',
        content: '在应用内打开部分链接（腾讯文档链接因无法正常在应用内打开，仍跳转到系统浏览器）'
      },
      {
        type: 'U',
        content: '应用内评论应用，无需跳转应用市场'
      },
      {
        type: 'U',
        content: '登录、支付业务场景支持网络加速'
      },
      {
        type: 'U',
        content: '支持预加载，缩短应用启动时间'
      },
      {
        type: 'U',
        content: '优化 js 异常捕获逻辑、弹窗文本'
      },
      {
        type: 'U',
        content: '接入 AppLinking，支持快速使用邀请码、兑换码'
      },
      {
        type: 'U',
        content: '禁止明文 HTTP 传输，提高安全性'
      },
      {
        type: 'U',
        content: '依次点击系统设置 - 存储 - 轩铭密码智能备忘录 - 前往清理数据可查看清理数据操作提示'
      },
      {
        type: 'U',
        content: '功能下线：AI 助手（原因：实用性低）'
      },
      {
        type: 'U',
        content: '功能下线：在线客服（原因：很多用户不转人工，导致客服收不到通知，无法及时回复）'
      },
      {
        type: 'U',
        content: '功能下线：腾讯频道（原因：交流性低）'
      },
      {
        type: 'U',
        content: '功能下线：智慧屏（原因：本应用功能不适合此类型设备使用）'
      },
      {
        type: 'F',
        content: '我的 - 设置 - 云备份 - 安全保障说明文本偏大'
      },
      {
        type: 'F',
        content: '我的 - 设置 - 关于 - 客服点击邮箱后未在邮件类应用（如“电子邮件”）中拉起“新建邮件”面板'
      },
      {
        type: 'F',
        content: '新增、修改常用信息、标签时数据库查询结果集未及时关闭，可能导致内存、句柄泄露'
      },
      {
        type: 'F',
        content: '自动设备间同步、备份密码、常用信息、标签数据判断系统是否处于（超级）省电模式逻辑错误'
      },
      {
        type: 'F',
        content: '静态快捷方式（长按桌面图标）图标未适配深色模式'
      },
      {
        type: 'F',
        content: '已知问题：可能无法正常获取密码列表'
      },
      {
        type: 'F',
        content: '已知问题：设备间无法成功同步数据'
      }
    ]
  },
  {
    versionNumber: '1.1.5.0',
    releaseDate: '2025-06-09',
    logs: [
      {
        type: 'U',
        content: '兑换码获取方式 新增 应用市场评论'
      },
      {
        type: 'U',
        content: '客服 新增 MeoW 频道'
      },
      {
        type: 'U',
        content: '调试页面修改部分信息属性名'
      },
      {
        type: 'U',
        content: '非手机上半模态页面样式改为居中'
      },
      {
        type: 'U',
        content: '修改部分组件四周间距使其在电脑、智慧屏上正确渲染'
      },
      {
        type: 'F',
        content: '卡证识别可能会报错'
      },
      {
        type: 'F',
        content: '只能对一个设备开启数据自动同步'
      },
      {
        type: 'F',
        content: '设备间同步数据入参错误'
      },
      {
        type: 'F',
        content: '基本模式下“自动上传故障日志”开关可能显示为开启状态'
      },
      {
        type: 'F',
        content: '登录过期时未自动退出登录'
      }
    ]
  },
  {
    versionNumber: '1.1.4.1',
    releaseDate: '2025-05-23',
    logs: [
      {
        type: 'A',
        content: '适配智慧屏'
      },
      {
        type: 'F',
        content: '新增、修改标签页面颜色未左对齐'
      }
    ]
  },
  {
    versionNumber: '1.1.4.0',
    releaseDate: '2025-05-20',
    logs: [
      {
        type: 'A',
        content: '我的 新增 恶意 URL 检测'
      }
    ]
  },
  {
    versionNumber: '1.1.3.0',
    releaseDate: '2025-05-19',
    logs: [
      {
        type: 'A',
        content: '我的 - 设置 - 通用新增 记忆主窗口尺寸（仅电脑端可用）'
      },
      {
        type: 'U',
        content: '优化 AI 助手功能'
      },
      {
        type: 'U',
        content: '修改会员中心页面阅读服务协议提示文本'
      },
      {
        type: 'U',
        content: '修改公安备案注册时间'
      },
      {
        type: 'U',
        content: '修改麦克风权限使用目的说明文本'
      },
      {
        type: 'F',
        content: '平板、折叠屏、电脑上首页仅在左侧窄区域右侧宽区域空白'
      },
      {
        type: 'F',
        content: '电脑端 txt 文件右键菜单打开时未弹窗提示导入数据'
      }
    ]
  },
  {
    versionNumber: '1.1.2.0',
    releaseDate: '2025-05-16',
    logs: [
      {
        type: 'A',
        content: '新增静态快捷方式（长按桌面应用图标）：新增密码、搜索密码'
      },
      {
        type: 'A',
        content: '电脑端支持右键 txt 文件导入数据（此功能目前无法使用，为能力预埋）'
      },
      {
        type: 'F',
        content: 'WLAN 断开时调试页面不显示应用安装、缓存、其他文件存储空间信息'
      }
    ]
  },
  {
    versionNumber: '1.1.1.0',
    releaseDate: '2025-05-15',
    logs: [
      {
        type: 'A',
        content: '我的 新增 密码随机生成'
      },
      {
        type: 'U',
        content: '权限管理页面中的“系统设置”文本支持点击跳转系统设置应用权限管理页面'
      },
      {
        type: 'F',
        content: '登录、应用服务模式页面查看的隐私政策可能不是最新版本'
      }
    ]
  },
  {
    versionNumber: '1.1.0.0',
    releaseDate: '2025-05-15',
    logs: [
      {
        type: 'A',
        content: '新增 AI 助手'
      },
      {
        type: 'A',
        content: '支持付费开通会员'
      },
      {
        type: 'U',
        content: '修改登录到期时间相关逻辑'
      },
      {
        type: 'U',
        content: '登录弹窗删除冗余取消禁止截、录屏逻辑'
      },
      {
        type: 'F',
        content: '设置、会员中心页面刷新会员状态逻辑不完善'
      },
      {
        type: 'F',
        content: '会员开通记录页面加载动画位置错误'
      }
    ]
  },
  {
    versionNumber: '1.0.2.1',
    releaseDate: '2025-05-12',
    logs: [
      {
        type: 'F',
        content: '用其他应用打开文件管理、微信等第三方应用中的 txt 文件时“选择打开方式”弹窗中无本应用'
      }
    ]
  },
  {
    versionNumber: '1.0.2.0',
    releaseDate: '2025-05-10',
    logs: [
      {
        type: 'A',
        content: '支持打开文件管理、微信等第三方应用中的 txt 文件用于导入数据'
      },
      {
        type: 'U',
        content: '我的 - 密码安全检查 - 重复按使用账号数从大到小排序、不显示使用账号数为 1 的'
      },
      {
        type: 'F',
        content: '设置页面未登录账号时上间距不正确'
      }
    ]
  },
  {
    versionNumber: '1.0.1.1',
    releaseDate: '2025-05-10',
    logs: [
      {
        type: 'U',
        content: '修改部分页面上间距'
      },
      {
        type: 'U',
        content: '修改页面间通信实现方式'
      },
      {
        type: 'F',
        content: '底部导航栏页面非首次进入时未刷新'
      }
    ]
  },
  {
    versionNumber: '1.0.1.0',
    releaseDate: '2025-05-09',
    logs: [
      {
        type: 'A',
        content: '我的 新增 密码安全检查'
      },
      {
        type: 'A',
        content: '支持创建应用分身（最多 5 个）'
      },
      {
        type: 'U',
        content: '修改底部导航栏实现方式'
      },
      {
        type: 'U',
        content: '修改部分场景禁止截、录屏时机'
      },
      {
        type: 'U',
        content: '提升数据库查询性能'
      },
      {
        type: 'U',
        content: '调试页面删减部分信息'
      },
      {
        type: 'U',
        content: '删除冗余图标资源文件，减小包体积'
      },
      {
        type: 'U',
        content: '仅信任系统预置的 CA 证书，不信任用户安装的 CA 证书，提高安全性'
      }
    ]
  },
  {
    versionNumber: '1.0.0.1',
    releaseDate: '2025-05-08',
    logs: [
      {
        type: 'U',
        content: '筛选密码弹窗推荐标签与已添加标签间添加分隔线'
      },
      {
        type: 'U',
        content: '优化兑换码获取方式文本'
      },
      {
        type: 'U',
        content: '优化设备间同步数据状态弹窗文本'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 已收集个人信息清单 - 故障日志 - 信息内容点击即可跳转故障日志页面'
      },
      {
        type: 'U',
        content: '修改查看用户协议的逻辑'
      },
      {
        type: 'U',
        content: '修改公安备案注册时间'
      },
      {
        type: 'U',
        content: '修改启动时检查更新判断是否在 WLAN 下的逻辑'
      },
      {
        type: 'F',
        content: '绑定华为账号页面“华为账号登录”按钮上方间距不正确'
      },
      {
        type: 'F',
        content: '兑换码获取方式文本行间距不正确'
      },
      {
        type: 'F',
        content: '导入自定义密钥成功后密钥页面未自动刷新'
      },
      {
        type: 'F',
        content: '查看的隐私政策可能不是最新版本'
      },
      {
        type: 'F',
        content: '有新版本时点击却再次检查更新'
      }
    ]
  },
  {
    versionNumber: '1.0.0.0',
    releaseDate: '2025-05-07',
    logs: [
      {
        type: 'A',
        content: '第一版本（邀请测试）'
      }
    ]
  }
]
</script>

<template>
  <div class="cz">
    <div v-for="item in data" class="cz">
      <div class="large-bold-text">Version {{ item.versionNumber }}（发布日期：{{ item.releaseDate }}）</div>
      <div v-for="(item, index) in item.logs" class="cz">
        <div class="sp">
          <div>{{ index + 1 }}.</div>
          <tiny-tag v-if="item.type == 'A'" type="success">A</tiny-tag>
          <tiny-tag v-if="item.type == 'U'" type="info">U</tiny-tag>
          <tiny-tag v-if="item.type == 'F'" color="grey">F</tiny-tag>
          <div>{{ item.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>