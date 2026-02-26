<template>
    <div>
        <Practice :mode="mode" />
    </div>
</template>

<script setup lang="ts">
import { useMode } from '@/composables/useMode'
import Practice from '@/components/Practice.vue'

const { mode } = useMode()

</script>