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
    ['btn', 'inline-block px-4 py-1 border border-transparent rounded bg-#7f7f7f0c disabled:opacity-20 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 hover:border-#646cff font-500 transition-all'],
    ['icon-btn', 'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-#646cff !outline-none'],
    ['text-active', 'text-#646cff dark:text-#646cff opacity-100'],
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
