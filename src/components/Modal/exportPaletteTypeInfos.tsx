import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { colorToHex, isContinuousPalette, isMatrixPalette } from '@antv/color-schema';
import type { Palette } from '@antv/color-schema';
import styles from './index.less';
import { SvgIcon, JSONIcon, ArrIcon } from '@/components/icons';

export const EXPORT_PALETTE_TYPES = ['svg', 'array', 'colorlab'];
export type ExportPaletteType = typeof EXPORT_PALETTE_TYPES[number];

const paletteToSvg = (palette: Palette, width = 350, height = 100) => {
  const rectWidth = width / palette.colors.length;
  const svg = (
    <svg width={width} height={height}>
      {!isContinuousPalette(palette) &&
        !isMatrixPalette(palette) &&
        palette.colors.map((color, i) => {
          const hexValue = colorToHex(color);
          return (
            <rect width={rectWidth} height={height} fill={hexValue} x={i * rectWidth} key={color.id || hexValue}></rect>
          );
        })}
    </svg>
  );
  return svg;
};
const elementToString = (el: React.ReactElement): string => {
  return ReactDOMServer.renderToString(el);
};

const paletteToJSONString = (palette: Palette): string => {
  return JSON.stringify(
    {
      brandName: 'colorLab',
      palettes: [palette],
    },
    null,
    2
  );
};

const paletteToArrayString = (palette: Palette): string => {
  if (!isContinuousPalette(palette) && !isMatrixPalette(palette)) {
    const arr = palette.colors.map((color) => colorToHex(color));
    return JSON.stringify(arr);
  }
  return '';
};

const downloadFile = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', url);
  downloadAnchorNode.setAttribute('download', fileName);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

type Download = (str: string, exportName?: string) => void;
const downloadSVG: Download = (svgString, exportName = 'palette.svg') => {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  downloadFile(blob, exportName);
};

const downloadJSON: Download = (jsonString, exportName = 'palette.json') => {
  const blob = new Blob([jsonString], { type: 'application/json' });
  downloadFile(blob, exportName);
};

const downloadJS: Download = (jsString, exportName = 'palette.js') => {
  const blob = new Blob([jsString], { type: 'text/javascript' });
  downloadFile(blob, exportName);
};
interface ExportPaletteTypeInfo {
  icon: React.ReactElement;
  convert: (palette: Palette) => {
    dom: React.ReactElement;
    str: string;
  };
  download: Download;
}
export const EXPORT_PALETTE_TYPE_INFOS: Record<ExportPaletteType, ExportPaletteTypeInfo> = {
  svg: {
    icon: <SvgIcon />,
    convert: (palette) => {
      const svg = paletteToSvg(palette);
      return {
        dom: <div className={styles.contentImage}>{svg}</div>,
        str: elementToString(svg),
      };
    },
    download: downloadSVG,
  },
  array: {
    icon: <ArrIcon />,
    convert: (palette) => {
      const arr = paletteToArrayString(palette);
      return {
        dom: <code className={styles.contentText}>{arr}</code>,
        str: arr,
      };
    },
    download: (str) => downloadJS(str),
  },
  colorlab: {
    icon: <JSONIcon />,
    convert: (palette) => {
      const code = paletteToJSONString(palette);
      return {
        dom: (
          <code className={styles.contentText}>
            <pre>{code}</pre>
          </code>
        ),
        str: code,
      };
    },
    download: (str) => downloadJSON(str, 'palette.colorlab'),
  },
};
