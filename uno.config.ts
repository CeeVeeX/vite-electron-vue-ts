import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['bg-emp', 'bg-hex-181d22'],
    ['bg-emp-2', 'bg-hex-ffffff30'],
    ['dock-item', 'pos-relative box-border inline-block h-164px w-164px flex flex-col cursor-pointer items-center text-gray-4 '],
    ['dock-item-icon', 'pos-relative box-border h-150px w-150px flex items-center justify-center overflow-hidden rounded-10px p-1  shadow-xl'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  rules: [
    // drag
    ['app-drag', {
      '-webkit-app-region': 'drag',
    }],
    ['app-no-drag', {
      '-webkit-app-region': 'no-drag',
    }],
  ],
  safelist: [
    'i-ix:plc-device',
    'i-ix:network-device',
    'i-ix:controller-device',
    'i-ix:thermometer',
    'i-ix:surveillance',
  ],
})
