<!--
 * @Author: your name
 * @Date: 2020-05-06 09:46:34
 * @LastEditTime: 2020-05-09 16:47:55
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \CnTp\src\components\tools\Logo.vue
 -->
<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <LogoSvg alt="logo" />
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    title: {
      type: String,
      default: '',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
