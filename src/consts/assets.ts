import type { ColorSchema } from '@antv/color-schema';

const ASSETS: ColorSchema = {
  brandName: 'colorLab',
  palettes: [
    {
      name: 'AntV10',
      semantic: null,
      type: 'categorical',
      colors: [
        {
          model: 'rgb',
          value: { r: 91, g: 143, b: 249 },
          name: 'Geek Blue',
        },
        {
          model: 'rgb',
          value: { r: 97, g: 221, b: 170 },
          name: 'Cyan',
        },
        {
          model: 'rgb',
          value: { r: 101, g: 120, b: 155 },
          name: 'Grey',
        },
        {
          model: 'rgb',
          value: { r: 246, g: 189, b: 22 },
          name: 'Sunrise Yellow',
        },
        {
          model: 'rgb',
          value: { r: 114, g: 98, b: 253 },
          name: 'Deep Purple',
        },
        {
          model: 'rgb',
          value: { r: 120, g: 211, b: 248 },
          name: 'Daybreak Blue',
        },
        {
          model: 'rgb',
          value: { r: 150, g: 97, b: 188 },
          name: 'Golden Purple',
        },
        {
          model: 'rgb',
          value: { r: 246, g: 144, b: 61 },
          name: 'Sunset Orange',
        },
        {
          model: 'rgb',
          value: { r: 0, g: 134, b: 133 },
          name: 'Dark Green',
        },
        {
          model: 'rgb',
          value: { r: 240, g: 139, b: 180 },
          name: 'Magenta',
        },
      ],
      colorScheme: 'polychromatic',
    },
    {
      name: 'Category10',
      semantic: null,
      type: 'categorical',
      colors: [
        {
          model: 'rgb',
          value: { r: 238, g: 140, b: 59 },
        },
        {
          model: 'rgb',
          value: { r: 211, g: 143, b: 195 },
        },
        {
          model: 'rgb',
          value: { r: 82, g: 188, b: 195 },
        },
        {
          model: 'rgb',
          value: { r: 34, g: 163, b: 74 },
        },
        {
          model: 'rgb',
          value: { r: 147, g: 100, b: 75 },
        },
        {
          model: 'rgb',
          value: { r: 243, g: 196, b: 43 },
        },
        {
          model: 'rgb',
          value: { r: 156, g: 72, b: 188 },
        },
        {
          model: 'rgb',
          value: { r: 252, g: 188, b: 156 },
        },
      ],
      colorScheme: 'polychromatic',
    },
    {
      name: 'Leaf Yellow',
      semantic: 'tranquil',
      type: 'discrete-scale',
      description: 'Colors of leaves in different seasons.',
      colors: [
        { model: 'rgb', value: { r: 255, g: 235, b: 176 } },
        { model: 'rgb', value: { r: 255, g: 223, b: 128 } },
        { model: 'rgb', value: { r: 250, g: 202, b: 62 } },
        { model: 'rgb', value: { r: 230, g: 184, b: 1 } },
        { model: 'rgb', value: { r: 181, g: 172, b: 35 } },
        { model: 'rgb', value: { r: 106, g: 154, b: 72 } },
        { model: 'rgb', value: { r: 32, g: 135, b: 107 } },
        { model: 'rgb', value: { r: 6, g: 116, b: 107 } },
        { model: 'rgb', value: { r: 4, g: 78, b: 72 } },
      ],
      colorScheme: 'analogous',
    },
    {
      name: 'Dust Red',
      semantic: '斗志 奔放',
      type: 'discrete-scale',
      colors: [
        {
          model: 'rgb',
          value: { r: 255, g: 241, b: 240 },
          name: 'red-1',
        },
        {
          model: 'rgb',
          value: { r: 255, g: 204, b: 199 },
          name: 'red-2',
        },
        {
          model: 'rgb',
          value: { r: 255, g: 163, b: 158 },
          name: 'red-3',
        },
        {
          model: 'rgb',
          value: { r: 255, g: 120, b: 117 },
          name: 'red-4',
        },
        {
          model: 'rgb',
          value: { r: 255, g: 77, b: 79 },
          name: 'red-5',
        },
        {
          model: 'rgb',
          value: { r: 245, g: 34, b: 45 },
          name: 'red-6',
        },
        {
          model: 'rgb',
          value: { r: 207, g: 19, b: 34 },
          name: 'red-7',
        },
        {
          model: 'rgb',
          value: { r: 168, g: 7, b: 26 },
          name: 'red-8',
        },
        {
          model: 'rgb',
          value: { r: 130, g: 0, b: 20 },
          name: 'red-9',
        },
        {
          model: 'rgb',
          value: { r: 92, g: 0, b: 17 },
          name: 'red-10',
        },
      ],
      colorScheme: 'monochromatic',
    },
    {
      name: 'Daybreak Blue',
      semantic: '包容 科技 普惠',
      type: 'discrete-scale',
      colors: [
        {
          model: 'rgb',
          value: { r: 230, g: 247, b: 255 },
          name: 'blue-1',
        },
        {
          model: 'rgb',
          value: { r: 186, g: 231, b: 255 },
          name: 'blue-2',
        },
        {
          model: 'rgb',
          value: { r: 145, g: 213, b: 255 },
          name: 'blue-3',
        },
        {
          model: 'rgb',
          value: { r: 105, g: 192, b: 255 },
          name: 'blue-4',
        },
        {
          model: 'rgb',
          value: { r: 64, g: 169, b: 255 },
          name: 'blue-5',
        },
        {
          model: 'rgb',
          value: { r: 24, g: 144, b: 255 },
          name: 'blue-6',
        },
        {
          model: 'rgb',
          value: { r: 9, g: 109, b: 217 },
          name: 'blue-7',
        },
        {
          model: 'rgb',
          value: { r: 0, g: 80, b: 179 },
          name: 'blue-8',
        },
        {
          model: 'rgb',
          value: { r: 0, g: 58, b: 140 },
          name: 'blue-9',
        },
        {
          model: 'rgb',
          value: { r: 0, g: 39, b: 102 },
          name: 'blue-10',
        },
      ],
      colorScheme: 'monochromatic',
    },
    {
      name: 'Sunset Orange',
      semantic: '温暖 欢快',
      type: 'discrete-scale',
      colors: [
        {
          model: 'rgb',
          value: { r: 255, g: 247, b: 230 },
          name: 'orange-1',
        },
        {
          model: 'rgb',
          value: { r: 255, g: 231, b: 186 },
          name: 'orange-2',
        },
        {
          model: 'rgb',
          value: { r: 255, g: 213, b: 145 },
          name: 'orange-3',
        },
        {
          model: 'rgb',
          value: { r: 255, g: 192, b: 105 },
          name: 'orange-4',
        },
        {
          model: 'rgb',
          value: { r: 255, g: 169, b: 64 },
          name: 'orange-5',
        },
        {
          model: 'rgb',
          value: { r: 250, g: 140, b: 22 },
          name: 'orange-6',
        },
        {
          model: 'rgb',
          value: { r: 212, g: 107, b: 8 },
          name: 'orange-7',
        },
        {
          model: 'rgb',
          value: { r: 173, g: 78, b: 0 },
          name: 'orange-8',
        },
        {
          model: 'rgb',
          value: { r: 135, g: 56, b: 0 },
          name: 'orange-9',
        },
        {
          model: 'rgb',
          value: { r: 97, g: 37, b: 0 },
          name: 'orange-10',
        },
      ],
      colorScheme: 'monochromatic',
    },
    {
      name: 'Red Blue',
      semantic: '气温',
      type: 'discrete-scale',
      colors: [
        {
          model: 'rgb',
          value: { r: 102, g: 25, b: 0 },
        },
        {
          model: 'rgb',
          value: { r: 230, g: 69, b: 15 },
        },
        {
          model: 'rgb',
          value: { r: 255, g: 140, b: 0 },
        },
        {
          model: 'rgb',
          value: { r: 255, g: 203, b: 51 },
        },
        {
          model: 'rgb',
          value: { r: 224, g: 242, b: 235 },
        },
        {
          model: 'rgb',
          value: { r: 26, g: 197, b: 255 },
        },
        {
          model: 'rgb',
          value: { r: 0, g: 127, b: 255 },
        },
        {
          model: 'rgb',
          value: { r: 0, g: 64, b: 255 },
        },
        {
          model: 'rgb',
          value: { r: 0, g: 31, b: 127 },
        },
      ],
      colorScheme: 'complementary',
    },
  ],
};

export default ASSETS;
