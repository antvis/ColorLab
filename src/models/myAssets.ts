import { useState, useEffect } from 'react';
import { isContinuousPalette, isMatrixPalette } from '@antv/color-schema';
import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import type { ColorSchema, Palette } from '@antv/color-schema';

export default () => {
  let defaultValue: ColorSchema = {
    brandName: '',
    palettes: [],
  };
  if (typeof window !== 'undefined') {
    const localAsset = localStorage.getItem('myAsset');
    if (localAsset) {
      defaultValue = JSON.parse(localAsset);
    }
  }

  const [myAssets, setMyAssets] = useState<ColorSchema>(defaultValue);
  const savePalette = (palettes: Palette[] | Palette) => {
    if (palettes instanceof Array) {
      const newAssets = cloneDeep(myAssets);
      for (let i = palettes.length - 1; i >= 0; i -= 1) {
        const palette = palettes[i];
        if (palette && palette.colors.length > 0 && !isContinuousPalette(palette) && !isMatrixPalette(palette)) {
          palette.id = uuidv4();
          newAssets.palettes.unshift(palette);
        }
      }
      setMyAssets(newAssets);
    } else {
      const palette = palettes;
      if (palette && palette.colors.length > 0 && !isContinuousPalette(palette) && !isMatrixPalette(palette)) {
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
    localStorage.setItem('myAsset', JSON.stringify(myAssets));
  }, [myAssets]);

  return {
    myAssets,
    savePalette,
    deletePalette,
  };
};
