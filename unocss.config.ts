import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  // transformerDirectives,
  // transformerVariantGroup,
} from 'unocss'

// @unocss-include

export default defineConfig({
  shortcuts: [
    ['btn', 'inline-block px-4 py-1 bg-#646cff bg-opacity-80 disabled:opacity-20 disabled:bg-zinc-500 hover:bg-opacity-100 font-500 transition-all text-white'],
    ['icon-btn', 'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-#646cff !outline-none disabled:(cursor-not-allowed op-50 hover:text-zinc)'],
    ['text-active', 'text-#646cff dark:text-#646cff opacity-100'],
    ['m-input', 'border border-zinc-300 dark:border-zinc-600 !outline-none px-2 py-1 bg-transparent leading-normal'],
    ['wsn', 'whitespace-nowrap'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  // transformers: [
  //   transformerDirectives(),
  //   transformerVariantGroup(),
  // ],
})
