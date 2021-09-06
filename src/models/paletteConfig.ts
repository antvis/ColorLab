import { useState } from 'react';
import { cloneDeep } from 'lodash';
import type { Color } from '@antv/color-schema';
import type { ColorSchemeInfo, ConfigItmeId } from '@/consts/colorSchemeInfos';
import { isRadioConfig } from '@/consts/colorSchemeInfos';

type paletteConfig = {
  [key in ConfigItmeId]?: any;
};

export default () => {
  const [paletteConfig, setPaletteConfig] = useState<paletteConfig>({});

  const setDefaultPaletteConfig = (colorSchemeInfo: ColorSchemeInfo) => {
    const newPaletteConfig: paletteConfig = {};
    colorSchemeInfo.config.forEach((item) => {
      if (isRadioConfig(item)) {
        [newPaletteConfig[item.id]] = item.options;
      } else {
        newPaletteConfig[item.id] = item.defaultVal;
      }
    });
    setPaletteConfig(newPaletteConfig);
  };

  const updatePaletteConfigItem = (key: ConfigItmeId, value: string | number | Color) => {
    const newPaletteConfig = cloneDeep(paletteConfig);
    newPaletteConfig[key] = value;
    setPaletteConfig(newPaletteConfig);
  };

  return {
    paletteConfig,
    setDefaultPaletteConfig,
    updatePaletteConfigItem,
  };
};
