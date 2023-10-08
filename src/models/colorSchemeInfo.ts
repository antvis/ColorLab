import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { COLOR_SCHEME_INFOS } from '@/consts/colorSchemeInfos';
import type { ColorSchemeInfo } from '@/consts/colorSchemeInfos';

export default () => {
  const { setDefaultPaletteConfig } = useModel('paletteConfig');
  const defaultColorSchemeInfo: ColorSchemeInfo = COLOR_SCHEME_INFOS[0];
  const [colorSchemeInfo, setSchemeInfo] = useState<ColorSchemeInfo>(defaultColorSchemeInfo);

  const setColorSchemeInfo = (info: ColorSchemeInfo) => {
    setSchemeInfo(info);
    setDefaultPaletteConfig(info);
  };

  useEffect(() => {
    setDefaultPaletteConfig(defaultColorSchemeInfo);
  }, []);

  return {
    colorSchemeInfo,
    setColorSchemeInfo,
  };
};
