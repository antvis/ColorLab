import { createContext, useContext, useState, useEffect } from "react";
import { noop } from "lodash";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";
import type { ColorSchema, Palette } from "@antv/color-schema";
import { isContinuousPalette, isMatrixPalette } from "@antv/color-schema";

let DEFAULT_COLOR_SCHEMA: ColorSchema = {
  brandName: "",
  palettes: [],
};

const MyAssetsContext = createContext({
  myAssets: DEFAULT_COLOR_SCHEMA as ColorSchema,
  savePalette: noop as (palettes: Palette[] | Palette) => void,
  deletePalette: noop as (index: number) => void,
});

const MyAssetsProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  if (typeof window !== "undefined") {
    const localAsset = localStorage.getItem("myAsset");
    if (localAsset) {
      DEFAULT_COLOR_SCHEMA = JSON.parse(localAsset);
    }
  }

  const [myAssets, setMyAssets] = useState<ColorSchema>(DEFAULT_COLOR_SCHEMA);

  const savePalette = (palettes: Palette[] | Palette) => {
    if (palettes instanceof Array) {
      const newAssets = cloneDeep(myAssets);
      for (let i = palettes.length - 1; i >= 0; i -= 1) {
        const palette = palettes[i];
        if (
          palette &&
          palette.colors.length > 0 &&
          !isContinuousPalette(palette) &&
          !isMatrixPalette(palette)
        ) {
          palette.id = uuidv4();
          newAssets.palettes.unshift(palette);
        }
      }
      setMyAssets(newAssets);
    } else {
      const palette = palettes;
      if (
        palette &&
        palette.colors.length > 0 &&
        !isContinuousPalette(palette) &&
        !isMatrixPalette(palette)
      ) {
        const newAssets = cloneDeep(myAssets);
        palette.id = uuidv4();
        newAssets.palettes.unshift(palette);
        setMyAssets(newAssets);
      }
    }
  };

  const deletePalette = (index: number) => {
    if (index < myAssets.palettes.length && index >= 0) {
      const newAssets = cloneDeep(myAssets);
      newAssets.palettes.splice(index, 1);
      setMyAssets(newAssets);
    }
  };

  useEffect(() => {
    localStorage.setItem("myAsset", JSON.stringify(myAssets));
  }, [myAssets]);

  return (
    <MyAssetsContext.Provider
      value={{
        myAssets,
        savePalette,
        deletePalette,
      }}
    >
      {children}
    </MyAssetsContext.Provider>
  );
};

export const withMyAssetsProvider =
  <T extends Record<string, any>>(Component: React.ComponentType<T>) =>
  (props: T) => {
    return (
      <MyAssetsProvider>
        <Component {...props} />
      </MyAssetsProvider>
    );
  };

export const useMyAssetsContext= () => {
  return useContext(MyAssetsContext);
};
