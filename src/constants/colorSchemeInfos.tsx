import React from 'react';
import { TENDENCIES } from '@antv/smart-color';
import {
  MonochromaticPaletteIcon,
  ComplementaryPaletteIcon,
  SplitComplementaryPaletteIcon,
  AchromaticPaletteIcon,
  AnalogousPaletteIcon,
  TriadicPaletteIcon,
  TetradicPaletteIcon,
  PolychromaticPaletteIcon,
  CustomizedPaletteIcon,
  GreyMonochromaticPaletteIcon,
  GreyComplementaryPaletteIcon,
  GreySplitComplementaryPaletteIcon,
  GreyAchromaticPaletteIcon,
  GreyAnalogousPaletteIcon,
  GreyTriadicPaletteIcon,
  GreyTetradicPaletteIcon,
  GreyPolychromaticPaletteIcon,
  GreyCustomizedPaletteIcon,
} from '@/components/icons';
import type { ColorSchemeType, Color } from '@antv/color-schema';

export interface ColorSchemeInfo {
  type: ColorSchemeType;
  name: string;
  icon: React.ReactNode;
  highlightIcon: React.ReactNode;
  description: string;
  config: PaletteConfig[];
}

export type ConfigItemId = 'count' | 'color' | 'tendency';
interface ConfigItem {
  id: ConfigItemId;
  name: string;
}

type NumberConfig = ConfigItem & {
  type: 'number';
  defaultVal: number;
  minVal: number;
  maxVal: number;
};

type ColorConfig = ConfigItem & {
  type: 'color';
  defaultVal: Color;
};

type RadioConfig = ConfigItem & {
  type: 'radio';
  options: readonly string[];
};

type PaletteConfig = NumberConfig | ColorConfig | RadioConfig;

export function isNumberConfig(config: PaletteConfig): config is NumberConfig {
  return config.type === 'number';
}

export function isColorConfig(config: PaletteConfig): config is ColorConfig {
  return config.type === 'color';
}

export function isRadioConfig(config: PaletteConfig): config is RadioConfig {
  return config.type === 'radio';
}

const colorNumber: NumberConfig = {
  type: 'number',
  id: 'count',
  name: 'Color Number',
  defaultVal: 7,
  minVal: 2,
  maxVal: 20,
};

const basicColor: ColorConfig = {
  type: 'color',
  id: 'color',
  name: 'Basic color',
  defaultVal: {
    model: 'rgb',
    value: {
      r: 91,
      g: 143,
      b: 249,
    },
  },
};

const tendency: RadioConfig = {
  type: 'radio',
  id: 'tendency',
  name: 'Gradient tendency',
  options: TENDENCIES,
};

export const COLOR_SCHEME_INFOS: ColorSchemeInfo[] = [
  {
    type: 'polychromatic',
    name: 'Polychromatic',
    icon: <GreyPolychromaticPaletteIcon />,
    highlightIcon: <PolychromaticPaletteIcon />,
    description:
      '多色配色模式可生成分类色板，用于描述分类数据，如苹果、香蕉、梨，常用一个颜色代表一个值以区分不同类型。',
    config: [colorNumber, basicColor],
  },
  {
    type: 'monochromatic',
    name: 'Monochromatic',
    icon: <GreyMonochromaticPaletteIcon />,
    highlightIcon: <MonochromaticPaletteIcon />,
    description: '单色配色模式以单一色相为基础，可生成顺序色板，融入高光（加入白色）或阴影（加入黑色）。',
    config: [colorNumber, basicColor, tendency],
  },
  {
    type: 'analogous',
    name: 'Analogous',
    icon: <GreyAnalogousPaletteIcon />,
    highlightIcon: <AnalogousPaletteIcon />,
    description:
      '类似色配色模式使用色环上距离相近的颜色，可生成顺序色板，通过明度或饱和度渐变，常用于热力图中的热度变化，通过临近色相差异凸显聚焦部分。',
    config: [colorNumber, basicColor, tendency],
  },
  {
    type: 'achromatic',
    name: 'Achromatic',
    icon: <GreyAchromaticPaletteIcon />,
    highlightIcon: <AchromaticPaletteIcon />,
    description:
      '无彩色配色模式仅使用黑白灰，在蚂蚁中后台的网页设计中被大量使用到，合理地选择中性色能够令页面信息具备良好的主次关系，助力阅读体验。',
    config: [colorNumber, tendency],
  },
  {
    type: 'complementary',
    name: 'Complementary',
    icon: <GreyComplementaryPaletteIcon />,
    highlightIcon: <ComplementaryPaletteIcon />,
    description:
      '互补配色模式使用色相环上全然相反的颜色，可生成种发散色板，来展现数据从负向值到0点再到正向值的连续变化区间，显示相对立的两个值的大小关系，常用于气温的冷海拔高度、股票涨跌等。',
    config: [colorNumber, basicColor],
  },
  {
    type: 'split-complementary',
    name: 'Split Complementary',
    icon: <GreySplitComplementaryPaletteIcon />,
    highlightIcon: <SplitComplementaryPaletteIcon />,
    description: '分裂补色配色模式把一个颜色和它的补色组合起来，可生成分类色板。',
    config: [colorNumber, basicColor],
  },
  {
    type: 'triadic',
    name: 'Triadic',
    icon: <GreyTriadicPaletteIcon />,
    highlightIcon: <TriadicPaletteIcon />,
    description: '三重轴配色模式使用色轮上等间距的三个颜色，可生成分类色板。',
    config: [colorNumber, basicColor],
  },
  {
    type: 'tetradic',
    name: 'Tetradic',
    icon: <GreyTetradicPaletteIcon />,
    highlightIcon: <TetradicPaletteIcon />,
    description: '四分体配色模式选择正交的两对互补色，可生成分类色板。',
    config: [colorNumber, basicColor],
  },
  {
    type: 'customized',
    name: 'Customized',
    icon: <GreyCustomizedPaletteIcon />,
    highlightIcon: <CustomizedPaletteIcon />,
    description: '自定义生成色板，现为随机生成。',
    config: [colorNumber],
  },
];
