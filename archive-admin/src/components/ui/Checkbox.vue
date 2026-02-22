<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  checked?: boolean
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  checked: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:checked': [value: boolean]
}>()

const handleClick = () => {
  if (!props.disabled) {
    emit('update:checked', !props.checked)
  }
}

const checkboxClasses = computed(() =>
  cn(
    'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'cursor-pointer transition-colors',
    props.checked && 'bg-primary text-primary-foreground',
    props.disabled && 'cursor-not-allowed opacity-50',
    props.class
  )
)
</script>

<template>
  <button
    type="button"
    role="checkbox"
    :aria-checked="checked"
    :disabled="disabled"
    :class="checkboxClasses"
    @click="handleClick"
  >
    <Check v-if="checked" class="h-3 w-3" />
  </button>
</template>
