import { createContext, useContext, useState, useCallback } from "react";
import { noop, cloneDeep } from "lodash";
import type { ColorSchemeInfo, ConfigItemId } from "@/consts/colorSchemeInfos";
import { isRadioConfig } from "@/consts/colorSchemeInfos";
import type { Color } from "@antv/color-schema";

type PaletteConfig = {
  [key in ConfigItemId]?: any;
};

const DEFAULT_PALETTE_CONFIG = {} as PaletteConfig;

const PaletteConfigContext = createContext({
  paletteConfig: DEFAULT_PALETTE_CONFIG,
  setDefaultPaletteConfig: noop as (colorSchemeInfo: ColorSchemeInfo) => void,
  updatePaletteConfigItem: noop as (
    key: ConfigItemId,
    value: string | number | Color
  ) => void,
});

const PaletteConfigProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [paletteConfig, setPaletteConfig] = useState<PaletteConfig>({});

  const setDefaultPaletteConfig = useCallback(
    (colorSchemeInfo: ColorSchemeInfo) => {
      const newPaletteConfig = DEFAULT_PALETTE_CONFIG;
      colorSchemeInfo.config.forEach((item) => {
        if (isRadioConfig(item)) {
          [newPaletteConfig[item.id]] = item.options;
        } else {
          newPaletteConfig[item.id] = item.defaultVal;
        }
      });
      setPaletteConfig(newPaletteConfig);
    },
    []
  );

  const updatePaletteConfigItem = useCallback(
    (key: ConfigItemId, value: string | number | Color) => {
      const newPaletteConfig = cloneDeep(paletteConfig);
      newPaletteConfig[key] = value;
      setPaletteConfig(newPaletteConfig);
    },
    []
  );

  return (
    <PaletteConfigContext.Provider
      value={{
        paletteConfig,
        setDefaultPaletteConfig,
        updatePaletteConfigItem,
      }}
    >
      {children}
    </PaletteConfigContext.Provider>
  );
};

export const withPaletteConfigProvider =
  <T extends Record<string, any>>(Component: React.ComponentType<T>) =>
  (props: T) => {
    return (
      <PaletteConfigProvider>
        <Component {...props} />
      </PaletteConfigProvider>
    );
  };

export const usePaletteConfigContext = () => {
  return useContext(PaletteConfigContext);
};
