import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ColorSchemeInfo } from "@/constants/colorSchemeInfos";
import { COLOR_SCHEME_INFOS } from "@/constants/colorSchemeInfos";
import { noop } from "lodash";
import { usePaletteConfigContext } from "@/contexts/paletteConfig";

const DEFAULT_COLOR_SCHEME_INFO: ColorSchemeInfo = COLOR_SCHEME_INFOS[0];

const ColorSchemeInfoContext = createContext({
  colorSchemeInfo: DEFAULT_COLOR_SCHEME_INFO,
  setColorSchemeInfo: noop as (info: ColorSchemeInfo) => void,
});

const ColorSchemeInfoProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { setDefaultPaletteConfig } = usePaletteConfigContext();

  const [colorSchemeInfo, setSchemeInfo] = useState<ColorSchemeInfo>(
    DEFAULT_COLOR_SCHEME_INFO
  );

  const setColorSchemeInfo = useCallback((info: ColorSchemeInfo) => {
    setSchemeInfo(info);
    setDefaultPaletteConfig(info);
  }, []);

  useEffect(() => {
    setDefaultPaletteConfig(DEFAULT_COLOR_SCHEME_INFO);
  }, []);

  return (
    <ColorSchemeInfoContext.Provider
      value={{
        colorSchemeInfo,
        setColorSchemeInfo,
      }}
    >
      {children}
    </ColorSchemeInfoContext.Provider>
  );
};

export const withColorSchemeInfoProvider =
  <T extends Record<string, any>>(Component: React.ComponentType<T>) =>
  (props: T) => {
    return (
      <ColorSchemeInfoProvider>
        <Component {...props} />
      </ColorSchemeInfoProvider>
    );
  };

export const useColorSchemeInfoContext = () => {
  return useContext(ColorSchemeInfoContext);
};
