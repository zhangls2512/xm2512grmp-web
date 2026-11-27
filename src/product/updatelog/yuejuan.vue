<script setup>
document.title = '轩铭2512 - 更新日志 - 阅卷'
const data = [
  {
    versionNumber: '1.0.0.3',
    releaseDate: '2026-11-25',
    logs: [
      {
        type: 'A',
        content: '学生考试 - 作答主观题支持删除已选择的图片'
      }
    ]
  },
  {
    versionNumber: '1.0.0.2',
    releaseDate: '2026-11-19',
    logs: [
      {
        type: 'A',
        content: '调试 - 设置 - 应用 - 沙箱文件管理器支持新建文件夹、上传文件、复制、移动、重命名、压缩文件夹、解压缩 zip 格式文件'
      }
    ]
  },
  {
    versionNumber: '1.0.0.1',
    releaseDate: '2026-11-06',
    logs: [
      {
        type: 'U',
        content: '学生按科目搜索成绩'
      },
      {
        type: 'U',
        content: '原卷支持导出'
      }
    ]
  },
  {
    versionNumber: '1.0.0.0',
    releaseDate: '2026-10-20',
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
      <div v-for="item, index in item.logs" class="cz">
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