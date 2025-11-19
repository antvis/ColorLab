import type { FC } from "react";
import React, { useState } from "react";
import { useCurrentPaletteContext } from "@/contexts/currentPalette";
import calssNames from "classnames";
import {
  colorToHex,
  isContinuousPalette,
  isMatrixPalette,
} from "@antv/color-schema";
import { Button } from "antd";
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import ExportPaletteModal from "@/components/Modal/ExportPaletteModal";
import type { Color, Palette } from "@antv/color-schema";
import styles from "./index.module.less";

interface SwatchProps {
  palette: Palette;
  toolbar?: boolean;
  handleDelete?: () => void;
}

interface ColorsProps {
  colorStyle: React.CSSProperties;
  colors: Color[];
  handleClick?: () => void;
}

const Colors: FC<ColorsProps> = ({
  colorStyle = {},
  colors = [],
  handleClick = () => {},
}) => {
  if (colors.length === 0) {
    return null;
  }
  return (
    <div className={styles.colors} onClick={handleClick}>
      {colors.map((color) => (
        <div
          className={styles.color}
          style={{
            ...colorStyle,
            backgroundColor: colorToHex(color),
          }}
          key={color.id || colorToHex(color)}
        />
      ))}
    </div>
  );
};

const Swatch: FC<SwatchProps> = ({ palette, handleDelete, toolbar = true }) => {
  const { setCurrentPalette } = useCurrentPaletteContext();
  const [isExporting, setIsExporting] = useState<boolean>(false);

  return (
    <div className={styles.swatch}>
      <div
        className={calssNames(styles.panel, {
          [styles.panelWithToolbal]: toolbar,
        })}
      >
        {!isContinuousPalette(palette) && !isMatrixPalette(palette) && (
          <Colors
            colorStyle={{
              width: `calc(${100 / palette.colors.length}%)`,
            }}
            colors={palette.colors}
            handleClick={() => {
              setCurrentPalette(palette);
            }}
          />
        )}
        {toolbar && (
          <div className={styles.toolbars}>
            {handleDelete && (
              <Button
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                type="text"
              />
            )}
            <Button
              icon={<DownloadOutlined />}
              onClick={() => setIsExporting(true)}
              type="text"
            />
            <ExportPaletteModal
              palette={palette}
              visible={isExporting}
              onCancel={() => setIsExporting(false)}
            ></ExportPaletteModal>
          </div>
        )}
      </div>
    </div>
  );
};

export default Swatch;
