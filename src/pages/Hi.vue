<script setup lang="ts">
const params = useRoute('/hi/[name]').params
const router = useRouter()

const { t } = useI18n()
</script>

<template>
  <div>
    <div i-carbon-pedestrian text-4xl inline-block />
    <p>
      {{ t('intro.hi', { name: params.name }) }}
    </p>
    <p text-sm op50>
      <em>{{ t('intro.dynamic-route') }}</em>
    </p>

    <div>
      <button text-sm m-3 mt-8 btn @click="router.back()">
        {{ t('button.back') }}
      </button>
    </div>
  </div>
</template>
