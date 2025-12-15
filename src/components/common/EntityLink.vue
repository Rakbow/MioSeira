<script setup lang="ts">
import {inject, onMounted, ref} from 'vue';
import {useI18n} from "vue-i18n";
import {API, Axios} from "@/api";
import {EditParam} from "@/service/entityService";
import {bs} from '@/service/baseService';

const {t} = useI18n();
const entity = inject<Entity>('entity')!;
const linkRes = ref([]);
const param = ref(new EditParam());

onMounted(() => {
  load();
});

const load = async () => {
  param.value.block = true;
  param.value.data = {
    entityType: entity!.type,
    entityId: entity!.id
  }
  const res = await Axios.post(API.ENTITY.LINK, param.value.data);
  if (res.success()) {
    linkRes.value = res.data;
  } else {
    bs!.toast.error(res.message);
  }
  param.value.block = false;
}
</script>

<template>
  <Panel>
    <template #header>
      <span><RIcon name="link"/><strong>{{ t('Link') }}</strong></span>
    </template>
    <div v-if="!linkRes.length">
      <span class="empty-search-result">{{ t('NoLink') }}</span>
    </div>
    <div v-else>
      <div v-for="item of linkRes as any" style="padding-bottom: .5rem">
<!--        <Divider v-if="linkRes.length !== 1" align="center"><b>{{ item.type.label }}</b></Divider>-->
        <span v-if="linkRes.length !== 1">
          <img src="https://oss.rakbow.com/common/arrowbit.gif" alt="" style="margin-right: .4rem" />
          <b style="color: var(--r-steel-500)">{{ item.type.label }}</b>
        </span>
        <div class="link-item" v-for="link of item.links">
          <img :src="`https://oss.rakbow.com/common/link/link-${link.tag ? link.tag : 'misc'}.png`" alt="" />&nbsp;
          <a class="link-item-title" :href="link.url" style="font-size: 1.1rem"
             :title="link.title" target="_blank" rel="noopener noreferrer">
            {{ link.title }}
          </a>
        </div>
      </div>
    </div>
  </Panel>
</template>

<style scoped lang="scss">
.link-item {
  display: flex;
  align-items: center;          /* 垂直居中 img 和 文本 */
  gap: .2rem;                     /* img 和文字之间的间距 */

  margin: 0 0 .4rem;
  padding: 0 2px;              /* 与父 div 边缘的“间歇” */
  height: 18px;                 /* 示例高度，可按需 */
  box-sizing: border-box;

  &-title {
    display: block;
    flex: 1;                      /* 占据剩余空间 */

    white-space: nowrap;          /* 不换行 */
    overflow: hidden;
    text-overflow: ellipsis;      /* 省略号 */

    text-decoration: none;
  }

}
</style>