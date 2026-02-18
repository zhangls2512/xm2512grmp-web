<script setup>
document.title = '轩铭2512 - 更新日志 - SynDSM 助手'
const data = [
  {
    versionNumber: '1.1.4.3',
    releaseDate: '2026-02-18',
    logs: [
      {
        type: 'A',
        content: '“相册”支持将图片或视频加入相册、从相册中删除，重命名、删除相册'
      }
    ]
  },
  {
    versionNumber: '1.1.4.2',
    releaseDate: '2026-02-14',
    logs: [
      {
        type: 'A',
        content: '调试 - 设置 - 基础 - 自动上传故障日志类型 新增 音频卡顿'
      },
      {
        type: 'U',
        content: '优化相册 - 照片样式'
      },
      {
        type: 'U',
        content: '自动上传故障日志类型默认值调整为“js 运行异常、崩溃”（默认关闭日志不详细的类型，降低因故障日志自动上传导致操作被中断的概率）'
      },
      {
        type: 'U',
        content: '应用启动时自动清理无用数据，同时下线我的 - 设置 - 更多 - 其他 - 清理数据 - 无用数据'
      }
    ]
  },
  {
    versionNumber: '1.1.4.1',
    releaseDate: '2026-02-12',
    logs: [
      {
        type: 'U',
        content: '我的 - 登录弹窗中“协议”默认值调整为“https”'
      },
      {
        type: 'U',
        content: '优化桌面、锁屏卡片的描述'
      }
    ]
  },
  {
    versionNumber: '1.1.4.0',
    releaseDate: '2026-02-09',
    logs: [
      {
        type: 'A',
        content: '文件 新增 上传'
      },
      {
        type: 'A',
        content: '支持预览 epub、mobi、azw、azw3 格式的电子书文件'
      },
      {
        type: 'A',
        content: '相册 - 照片 新增 上传'
      },
      {
        type: 'A',
        content: '“相册”中“详情”弹窗支持查看相机型号、光圈、曝光时间、焦距、感光度、纬度、经度、地点'
      },
      {
        type: 'A',
        content: '账号支持复制地址（长按或鼠标右键“切换账号”弹窗中的账号，在弹出菜单中选择“复制地址”）'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 账号 新增 地址组'
      },
      {
        type: 'A',
        content: '我的 - 设置 新增 备份（登录账号时可见）'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 通用 - 通用 - 更多 新增 缓存消息 JSON 字符串'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 更多 - 其他 - 清理数据 - 缓存 新增 消息 JSON 字符串'
      },
      {
        type: 'A',
        content: '调试 - 设置 - 应用 - 沙箱文件删除工具 升级为 沙箱文件管理器'
      },
      {
        type: 'A',
        content: '调试 - 设置 新增 隐藏功能 - 群晖产品下载中心'
      },
      {
        type: 'U',
        content: '6.x 版本 DSM 消息主题用户友好化'
      },
      {
        type: 'U',
        content: '“相册”照片缩略图下载 DSM 提供的缩略图（之前是先下载原图再在本地压缩）'
      },
      {
        type: 'U',
        content: '“相册”删除照片、动态照片成功后同步删除对应缓存（仅在本应用内删除成功后生效，在非本应用删除成功后本应用中对应缓存不会同步删除）'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 通用 - 通用 - 界面 - 背景图支持拍照'
      },
      {
        type: 'U',
        content: '依次点击系统设置 - 通知和状态栏 - SynDSM 助手 - 前往“SynDSM 助手”管理可拉起“消息通知”页面'
      },
      {
        type: 'U',
        content: '电脑端文件右键菜单文本修改为操作名称（以前为应用名称）'
      },
      {
        type: 'F',
        content: '切换账号后未立即刷新卡片'
      },
      {
        type: 'F',
        content: '“套件”卡片未检查群晖官方套件更新'
      },
      {
        type: 'F',
        content: '“Docker 容器”卡片中删除 Docker 容器时报错'
      },
      {
        type: 'F',
        content: '“Docker 容器”卡片中图标尺寸可能过大'
      },
      {
        type: 'F',
        content: '我的 - 设置 - 更多 - 其他 - 清理数据 - 缓存 - 相册照片缩略图无相册照片缩略图缓存时清理会报错'
      },
      {
        type: 'F',
        content: '静态快捷方式（长按或鼠标右键桌面应用图标）图标未适配深色模式'
      }
    ]
  },
  {
    versionNumber: '1.1.3.4',
    releaseDate: '2026-01-27',
    logs: [
      {
        type: 'A',
        content: '卡片 新增 套件、Docker 容器'
      },
      {
        type: 'A',
        content: 'zip 文件支持长按（鼠标右键）解压缩'
      },
      {
        type: 'A',
        content: '我的 - 登录 新增 备注'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 数据与隐私 - 权限管理 新增 联网'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 更多 - 其他 - 清理数据 - 缓存 新增 相册照片缩略图'
      },
      {
        type: 'A',
        content: '调试 新增 信息'
      },
      {
        type: 'U',
        content: '“卡片”支持自定义展示顺序'
      },
      {
        type: 'U',
        content: '消息主题用户友好化'
      },
      {
        type: 'U',
        content: '“相册”页面优化内存占用'
      },
      {
        type: 'U',
        content: '相册 - 照片顶部显示照片、视频个数'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 更多 - 其他 - 清理数据 - 设置清理成功后弹窗提示“需重启应用生效”'
      },
      {
        type: 'U',
        content: '应用启动时自动切换登录与当前登录账号备注相同且非空所有账号中最快建立连接的账号'
      },
      {
        type: 'U',
        content: '底部导航栏组件改为 HdsTabs、页面导航组件改为 HdsNavigation、HdsNavDestination'
      },
      {
        type: 'F',
        content: '进入“卡片”页面时未立即刷新卡片'
      },
      {
        type: 'F',
        content: '无法成功新建名称为纯数字的文件夹、将文件（夹）重命名为纯数字'
      },
      {
        type: 'F',
        content: 'Navigation、NavDestination 组件页面标题过长时遮挡右上角“关闭”图标按钮'
      },
      {
        type: 'F',
        content: 'ImagePacker、ImageSource、PixelMap 对象使用完成后未主动、及时释放其内存'
      }
    ]
  },
  {
    versionNumber: '1.1.3.3',
    releaseDate: '2026-01-12',
    logs: [
      {
        type: 'F',
        content: '“存储空间信息”卡片中“存储池”应为“存储空间”且序号与实际不符'
      }
    ]
  },
  {
    versionNumber: '1.1.3.2',
    releaseDate: '2026-01-10',
    logs: [
      {
        type: 'A',
        content: '文件 新增 全选、取消全选'
      }
    ]
  },
  {
    versionNumber: '1.1.3.1',
    releaseDate: '2026-01-01',
    logs: [
      {
        type: 'U',
        content: '我的 - 设置 - 关于修改底部版权声明中的年份'
      }
    ]
  },
  {
    versionNumber: '1.1.3.0',
    releaseDate: '2025-12-31',
    logs: [
      {
        type: 'A',
        content: '卡片 新增 存储空间信息、硬盘信息、网络信息、资源监控'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 通用 新增 卡片'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 通用 - 通用 - 应用 新增 状态栏（仅电脑端可用）'
      },
      {
        type: 'A',
        content: '新增静态快捷方式（长按或鼠标右键桌面应用图标）：卡片、文件、相册'
      },
      {
        type: 'U',
        content: '初步适配 6.x 版本 DSM'
      },
      {
        type: 'U',
        content: '优化自动上传故障日志流程'
      }
    ]
  },
  {
    versionNumber: '1.1.2.2',
    releaseDate: '2025-12-22',
    logs: [
      {
        type: 'U',
        content: '应用预加载到 AbilityStage 创建完成阶段（以前为到 WindowStage 创建完成阶段）'
      }
    ]
  },
  {
    versionNumber: '1.1.2.1',
    releaseDate: '2025-12-20',
    logs: [
      {
        type: 'A',
        content: '我的 - 设置 - 账号 新增 碰一碰 / 隔空传送同步到邻近设备（非平板端可用）'
      },
      {
        type: 'U',
        content: '兼容 1.1.2.0 之前版本生成的账号数据'
      }
    ]
  },
  {
    versionNumber: '1.1.2.0',
    releaseDate: '2025-12-12',
    logs: [
      {
        type: 'A',
        content: '我的 新增 传输任务（登录账号时可见）'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 通用 新增 传输 - 下载目录（非手机端可用）'
      },
      {
        type: 'A',
        content: '文件支持多选批量下载'
      },
      {
        type: 'A',
        content: '账号支持设置备注（长按或鼠标右键“切换账号”弹窗中的账号，在弹出菜单中选择“编辑备注”）'
      }
    ]
  },
  {
    versionNumber: '1.1.1.5',
    releaseDate: '2025-12-09',
    logs: [
      {
        type: 'U',
        content: '“相册”支持视频'
      },
      {
        type: 'U',
        content: '未切换账号非首次进入“相册”时相册 - 照片不刷新'
      },
      {
        type: 'U',
        content: '提升获取 API 版本号缓存性能（读取内存，以前为读取文件）'
      },
      {
        type: 'U',
        content: 'API 版本号缓存损坏（JSON 解析失败）时自动清空重新建立缓存，提升稳定性'
      },
      {
        type: 'U',
        content: '功能下线：底部导航栏（Tab 组件）可以通过滑动上方页面进行页面切换（原因：降低手势冲突概率）'
      },
      {
        type: 'F',
        content: '切换账号后“文件”“相册”可能会刷新切换前账号的资源导致 DSM 接口调用失败'
      },
      {
        type: 'F',
        content: '导入的账号登录状态错误均为已登录'
      }
    ]
  },
  {
    versionNumber: '1.1.1.4',
    releaseDate: '2025-12-06',
    logs: [
      {
        type: 'A',
        content: '我的 - 设置 - 通用 - 更多 新增 API 版本号缓存'
      },
      {
        type: 'U',
        content: '提升“相册”图片列表滚动性能'
      },
      {
        type: 'U',
        content: '调整页面与屏幕左、右边缘的间距'
      },
      {
        type: 'F',
        content: '相册 - 照片同一个日期可能会显示多次'
      },
      {
        type: 'F',
        content: '应用启动后拉起的“切换账号”弹窗标题栏重复显示'
      }
    ]
  },
  {
    versionNumber: '1.1.1.3',
    releaseDate: '2025-12-05',
    logs: [
      {
        type: 'F',
        content: '“相册”加载逻辑不完善'
      }
    ]
  },
  {
    versionNumber: '1.1.1.2',
    releaseDate: '2025-12-04',
    logs: [
      {
        type: 'U',
        content: '“相册”分页加载、使用流量联网时弹窗询问是否加载、“照片”按日期降序分类显示'
      }
    ]
  },
  {
    versionNumber: '1.1.1.1',
    releaseDate: '2025-12-02',
    logs: [
      {
        type: 'U',
        content: '我的 - 设置 - 通用 - 相册 - 显示默认开启'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 更多 - 其他 - 清理数据多选框右对齐显示、本地文件类清理项显示大小、使用 API21 中的新 API 清理应用缓存'
      },
      {
        type: 'U',
        content: '支持在系统分享弹窗中分享 txt 文件到本应用以导入账号数据'
      },
      {
        type: 'U',
        content: '根据纵向断点（以前为设备类型）动态调整横竖屏布局模式'
      }
    ]
  },
  {
    versionNumber: '1.1.1.0',
    releaseDate: '2025-11-17',
    logs: [
      {
        type: 'A',
        content: '相册支持预览图片、查看图片详情、下载图片、删除图片、查看相册中的图片'
      },
      {
        type: 'U',
        content: '注销会话退出登录时不删除本地存储的账号数据'
      },
      {
        type: 'F',
        content: '复制、移动、删除文件时弹窗提示成功但实际未执行完成'
      },
      {
        type: 'F',
        content: '“切换账号”弹窗底部间距不正确'
      }
    ]
  },
  {
    versionNumber: '1.1.0.0',
    releaseDate: '2025-11-16',
    logs: [
      {
        type: 'A',
        content: '新增“相册”（需开启我的 - 设置 - 通用 - 相册 - 显示开关）'
      },
      {
        type: 'U',
        content: '“登录”弹窗、调试 - 设置 - 网络 - 自定义 DNS 服务器中“端口”禁止为 0'
      },
      {
        type: 'U',
        content: '“切换账号”弹窗右上角新增“+”图标，单击（鼠标左键）可拉起“登录”弹窗以登录切换到新账号'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 关于 新增 产品路线图'
      }
    ]
  },
  {
    versionNumber: '1.0.3.6',
    releaseDate: '2025-11-15',
    logs: [
      {
        type: 'U',
        content: '修改“我的”中“退出登录”按钮样式'
      },
      {
        type: 'U',
        content: '“登录”弹窗、调试 - 设置 - 网络 - 自定义 DNS 服务器中“端口”输入框显示默认值'
      },
      {
        type: 'U',
        content: '按钮（Button 组件）长度占满一行'
      },
      {
        type: 'U',
        content: '单击（鼠标左键）图标按钮时其背景颜色会变化'
      },
      {
        type: 'U',
        content: '底部导航栏位置适配 PuraX 外屏'
      },
      {
        type: 'F',
        content: '基本模式下调试 - 设置 - 基础 - 保存故障日志、应用启动时清理历史版本故障日志开关错误被禁用'
      }
    ]
  },
  {
    versionNumber: '1.0.3.5',
    releaseDate: '2025-11-13',
    logs: [
      {
        type: 'A',
        content: '调试 - 设置 - 网络 新增 自定义 DNS 服务器'
      },
      {
        type: 'U',
        content: '消息层级、类别、主题用户友好化'
      },
      {
        type: 'U',
        content: '默认开启我的 - 设置 - 通用 - 更多 - 缓存 API 版本号'
      }
    ]
  },
  {
    versionNumber: '1.0.3.4',
    releaseDate: '2025-11-13',
    logs: [
      {
        type: 'A',
        content: '调试 - 设置 - 基础 新增 应用启动时清理历史版本故障日志'
      },
      {
        type: 'F',
        content: '“我的”深色模式下部分 UI 组件背景颜色不正确'
      }
    ]
  },
  {
    versionNumber: '1.0.3.3',
    releaseDate: '2025-11-12',
    logs: [
      {
        type: 'U',
        content: '调试 - 设置 - 基础 - 进程缓存后快速启动调整为仅手机、电脑端可用'
      }
    ]
  },
  {
    versionNumber: '1.0.3.2',
    releaseDate: '2025-11-12',
    logs: [
      {
        type: 'U',
        content: '我的 - 切换账号选择当前已登录的账号时直接关闭弹窗（以前为弹窗提示“已登录此账号，无需重复登录”）、新增表示地址网络连通状态的彩色圆点'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 通用 - 文件 - 预览方式选项“系统预览服务”更名为“系统预览”'
      },
      {
        type: 'U',
        content: '满足评分条件（新版本发布且距上次评分已经一年）进入我的 - 设置 - 关于时拉起应用评分弹窗'
      },
      {
        type: 'U',
        content: '修改应用启动后拉起切换账号弹窗的触发条件'
      },
      {
        type: 'U',
        content: '应用冷启动时预加载应用入口所使用的系统 so，优化应用的冷启动性能'
      },
      {
        type: 'U',
        content: '不再使用系统废弃 API'
      },
      {
        type: 'U',
        content: '功能下线：调试 - 设置 - 电池电量低阈值（原因：无功能使用此设置）'
      }
    ]
  },
  {
    versionNumber: '1.0.3.1',
    releaseDate: '2025-11-08',
    logs: [
      {
        type: 'A',
        content: '我的 - 设置 - 通用 - 文件 新增 自定义下载位置'
      },
      {
        type: 'U',
        content: '修改校验下载文件完整性的逻辑'
      },
      {
        type: 'F',
        content: '使用 QuickConnect ID 登录时预览、下载文件功能异常'
      }
    ]
  },
  {
    versionNumber: '1.0.3.0',
    releaseDate: '2025-11-08',
    logs: [
      {
        type: 'A',
        content: '我的 新增 系统 - 重启、关机（登录账号时可见）'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 通用 新增 文件 - 预览方式、在线预览音视频'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 通用 - 更多 新增 应用启动后拉起切换账号弹窗、缓存 API 版本号'
      },
      {
        type: 'U',
        content: '功能下线：智能客服（原因：功能建设中，建设完毕后恢复）'
      }
    ]
  },
  {
    versionNumber: '1.0.2.13',
    releaseDate: '2025-11-05',
    logs: [
      {
        type: 'U',
        content: '我的 - 设置 - 通用 - 界面 - 窗口置顶调整为仅电脑端可用'
      },
      {
        type: 'U',
        content: '修改公安备案注册时间'
      },
      {
        type: 'F',
        content: '请求 IP 与登录 IP 不一致时会报错'
      }
    ]
  },
  {
    versionNumber: '1.0.2.12',
    releaseDate: '2025-11-03',
    logs: [
      {
        type: 'U',
        content: '“文件”修改刷新动画显示位置'
      },
      {
        type: 'U',
        content: '电脑端部分组件鼠标悬浮在其上时其背景颜色会变化'
      },
      {
        type: 'F',
        content: '移动单个文件（夹）时错误执行了复制操作'
      },
      {
        type: 'F',
        content: '进入我的 - 设置 - 关于时可能会报错'
      },
      {
        type: 'F',
        content: '电脑端鼠标右键未弹出菜单'
      }
    ]
  },
  {
    versionNumber: '1.0.2.11',
    releaseDate: '2025-11-01',
    logs: [
      {
        type: 'U',
        content: '调试 - 设置 - 网络 新增 连接 DSM 时跳过 SSL 验证'
      },
      {
        type: 'F',
        content: '解析消息获取其时间时可能会报错'
      },
      {
        type: 'F',
        content: '无后缀名文件获取其对应类型的图标时会报错'
      }
    ]
  },
  {
    versionNumber: '1.0.2.10',
    releaseDate: '2025-10-31',
    logs: [
      {
        type: 'F',
        content: '横屏时底部导航栏页面无上间距'
      },
      {
        type: 'F',
        content: '“文件”多选界面未适配大字场景'
      }
    ]
  },
  {
    versionNumber: '1.0.2.9',
    releaseDate: '2025-10-30',
    logs: [
      {
        type: 'A',
        content: '文件支持多选批量复制、移动、删除'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 关于 新增 资质证照'
      },
      {
        type: 'U',
        content: '“文件”支持侧滑返回上级文件夹'
      },
      {
        type: 'U',
        content: '显示方向跟随传感器旋转'
      }
    ]
  },
  {
    versionNumber: '1.0.2.8',
    releaseDate: '2025-10-22',
    logs: [
      {
        type: 'U',
        content: '“文件”顶部操作区不跟随页面滚动'
      },
      {
        type: 'U',
        content: '复制、移动文件时右上角叉、勾图标颜色分别改为红、绿'
      },
      {
        type: 'F',
        content: '“文件”刷新逻辑错误'
      },
      {
        type: 'F',
        content: '部分界面未适配大字场景'
      }
    ]
  },
  {
    versionNumber: '1.0.2.7',
    releaseDate: '2025-10-22',
    logs: [
      {
        type: 'A',
        content: '我的 - 设置 - 账号 新增 设备间同步'
      },
      {
        type: 'U',
        content: '适配大字场景'
      }
    ]
  },
  {
    versionNumber: '1.0.2.6',
    releaseDate: '2025-10-20',
    logs: [
      {
        type: 'U',
        content: '“文件”根据文件后缀名显示对应类型的图标'
      }
    ]
  },
  {
    versionNumber: '1.0.2.5',
    releaseDate: '2025-10-19',
    logs: [
      {
        type: 'A',
        content: '音视频文件预览方式调整为在线播放'
      }
    ]
  },
  {
    versionNumber: '1.0.2.4',
    releaseDate: '2025-10-16',
    logs: [
      {
        type: 'A',
        content: '支持复制、移动文件（夹）'
      },
      {
        type: 'U',
        content: '“文件”中“新建文件夹”按钮调整为圆形透明图标按钮'
      },
      {
        type: 'U',
        content: '新建文件夹、重命名文件（夹）成功时才刷新“文件”页面'
      },
      {
        type: 'U',
        content: '修改校验下载文件完整性的逻辑'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 通用 - 更多 - 流量下载提醒 调整为 流量使用提醒'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 更多 - 其他 - 清理数据 - 无用数据 调整为 临时文件、无用通用设置'
      },
      {
        type: 'U',
        content: '应用字体最大放大倍数调整为 1.75'
      },
      {
        type: 'F',
        content: '会话注销失败时错误删除了账号'
      }
    ]
  },
  {
    versionNumber: '1.0.2.3',
    releaseDate: '2025-10-14',
    logs: [
      {
        type: 'U',
        content: '修改校验下载文件完整性的逻辑'
      },
      {
        type: 'U',
        content: '未联网状态应用冷启动时不检查更新'
      },
      {
        type: 'F',
        content: '导入账号时可能会报错'
      },
      {
        type: 'F',
        content: '登录态自动续期触发时机错误'
      }
    ]
  },
  {
    versionNumber: '1.0.2.2',
    releaseDate: '2025-10-13',
    logs: [
      {
        type: 'A',
        content: '我的 - 设置 - 通用 - 更多 新增 流量下载提醒'
      },
      {
        type: 'U',
        content: '进入新建文件夹、重命名页面时输入框自动获焦'
      },
      {
        type: 'U',
        content: '支持应用在后台时下载文件'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 通用 - 更多 - 启动时检查更新选项“仅 WLAN 下”调整为“非流量下”'
      },
      {
        type: 'U',
        content: '应用字体最大放大倍数调整为 2'
      },
      {
        type: 'U',
        content: '功能下线：我的 - 设置 - 通用 - 界面 - 敏感页面禁止截、录屏（原因：系统会在输入密码时自动禁止截、录屏）'
      },
      {
        type: 'U',
        content: '功能下线：车机（原因：本应用部分功能不支持在此类型设备上使用）'
      }
    ]
  },
  {
    versionNumber: '1.0.2.1',
    releaseDate: '2025-10-13',
    logs: [
      {
        type: 'A',
        content: '“文件”新增搜索框（非根目录时可见）、左上角返回上级目录按钮、下拉刷新'
      },
      {
        type: 'A',
        content: '清理数据 新增 无用数据'
      },
      {
        type: 'U',
        content: '支持预览文件的大小上限调整为 1 GB'
      },
      {
        type: 'U',
        content: '删除底部导航栏页面与底部导航栏之间的间距'
      },
      {
        type: 'U',
        content: '底部导航栏背景添加模糊效果'
      },
      {
        type: 'F',
        content: '深色模式下卡片背景颜色不正确'
      },
      {
        type: 'F',
        content: '预览临时文件存储目录错误'
      },
      {
        type: 'F',
        content: '文件下载成功时可能会报错'
      },
      {
        type: 'F',
        content: '根目录文件夹重命名成功后文件夹消失'
      },
      {
        type: 'F',
        content: '全局捕获到异常时可能会报错'
      }
    ]
  },
  {
    versionNumber: '1.0.2.0',
    releaseDate: '2025-10-11',
    logs: [
      {
        type: 'A',
        content: '新增“文件”'
      },
      {
        type: 'A',
        content: '设置 新增 账号，支持导入（本地无账号时可见）、导出本地账号数据'
      },
      {
        type: 'U',
        content: '消息 新增 清除全部'
      },
      {
        type: 'U',
        content: '功能下线：“消息”分页加载（原因：默认即获取全部，无需分页加载）'
      },
      {
        type: 'U',
        content: '功能下线：底部导航栏（Tab 组件）背后变模糊并叠加在上方页面之上（原因：可能遮挡上方页面底部的内容）'
      },
      {
        type: 'U',
        content: '功能下线：部分已知错误码显示用户友好化的错误信息（原因：不同 API 可能返回值相同但问题原因不同的错误码，导致显示的错误信息可能与实际问题原因不符）'
      }
    ]
  },
  {
    versionNumber: '1.0.1.3',
    releaseDate: '2025-10-10',
    logs: [
      {
        type: 'U',
        content: '支持使用 QuickConnect ID 登录'
      },
      {
        type: 'U',
        content: '请求 DSM 失败弹窗文本改为“DSM 请求失败，错误码：xxx”（以前为“请求失败 / 发生错误，错误码：xxx”）'
      }
    ]
  },
  {
    versionNumber: '1.0.1.2',
    releaseDate: '2025-10-09',
    logs: [
      {
        type: 'U',
        content: '新密码账号登录成功时自动删除旧密码账号'
      },
      {
        type: 'U',
        content: '退出登录时支持选择是否注销会话'
      },
      {
        type: 'U',
        content: '部分已知错误码显示用户友好化的错误信息'
      },
      {
        type: 'U',
        content: '自动上传故障日志类型默认值调整为“js 运行异常、应用崩溃、应用冻屏、应用查杀、资源泄漏、地址越界”（默认关闭与性能相关的类型，降低因故障日志自动上传导致操作被中断的概率）'
      }
    ]
  },
  {
    versionNumber: '1.0.1.1',
    releaseDate: '2025-10-07',
    logs: [
      {
        type: 'U',
        content: '支持登录开启 MFA 二次验证的账号'
      },
      {
        type: 'F',
        content: '手动关闭通知权限后，应用冷启动时会报错'
      }
    ]
  },
  {
    versionNumber: '1.0.1.0',
    releaseDate: '2025-10-07',
    logs: [
      {
        type: 'A',
        content: '“卡片”右上角新增“消息”'
      },
      {
        type: 'A',
        content: '清理数据 - 设置 新增 卡片'
      },
      {
        type: 'U',
        content: '调整卡片中文本行间距，布局更紧凑'
      },
      {
        type: 'U',
        content: 'Webview 组件滚动不与父组件联动'
      },
      {
        type: 'F',
        content: '接续过程中版本号校验逻辑错误'
      }
    ]
  },
  {
    versionNumber: '1.0.0.0',
    releaseDate: '2025-10-06',
    logs: [
      {
        type: 'A',
        content: '第一版本'
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