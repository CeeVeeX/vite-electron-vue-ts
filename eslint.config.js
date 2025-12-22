// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    pnpm: true,
    rules: {
      'node/prefer-global/process': 'off',
      'pnpm/yaml-enforce-settings': 'off',
    },
  },
)
