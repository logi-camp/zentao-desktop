import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'
import { themeable, Theme, ColorHex } from 'tailwindcss-themeable';
import _ from 'lodash';

export type ColorName =
  | 'background'
  | 'foreground'
  | 'gray'
  | 'selection'
  | 'comment'
  | 'red'
  | 'secondary'
  | 'primary'
  | 'white'
  | 'black'
  | 'error'
  | 'success'
  | 'warning'
  | 'info';

export const themes: [Theme] = [
  {
    name: 'default',
    palette: {
      // color palette key: hex code
      background: '#dfdfdf',
      foreground: '#333333',
      gray: '#828282',
      selection: '#4499ff', //TODO
      comment: '#43687A', //TODO
      red: '#EB5757',
      secondary: '#FF8B2D',
      primary: '#10B981',
      white: '#ffffff',
      black: '#000000',
      error: '#ff5000',
      success: '#00ff00',
      warning: '#ffdd00',
      info: '#55aaff',
    } as Record<ColorName, ColorHex>,
    isDark: false,
  },
];

const colorClassFormats = [
  (colorName: string) => 'bg-theme-' + colorName,
  (colorName: string) => '!bg-theme-' + colorName,
  (colorName: string) => 'text-theme-' + colorName,
  (colorName: string) => '!text-theme-' + colorName,
];

export const colorPalette = [
  ...new Set(
    themes.reduce<string[]>(
      (acm, theme) => [
        ...acm,
        ...Object.entries(theme.palette).reduce<string[]>((acm2, [colorName]) => {
          return [
            ...acm2,
            ..._.range(-1, 10).reduce<string[]>(
              (acm3, i) => [...acm3, colorName + (i >= 0 ? '-' + (i === 0 ? 50 : i * 100) : '')],
              []
            ),
          ];
        }, []),
      ],
      []
    )
  ),
];

const safelist = colorPalette.reduce(
  //@ts-ignore
  (acm, color) => [...acm, ...colorClassFormats.map((fn) => fn(color))],
  []
);



export default defineConfig({
  attributify: true,
  theme: {
    colors: {
      // Configure your color palette here
      ...colors
    },
  },
  plugins: [
    themeable({
      defaultTheme: 'post',
      classPrefix: 'theme',
      themes,
    }),
    require('@windicss/plugin-scrollbar'),
  ],
  safelist
})