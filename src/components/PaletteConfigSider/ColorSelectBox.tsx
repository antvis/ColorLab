import { useState } from "react";
import { SketchPicker } from "react-color";
import { colorToHex, hexToColor } from "@antv/smart-color";
import type { Color } from "@antv/color-schema";
import styles from "./index.module.less";

interface ColorSelectBoxProps {
  color: Color;
  onChange: (value: Color) => void;
}

const ColorSelectBox: React.FC<ColorSelectBoxProps> = ({ color, onChange }) => {
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const closeColorPicker = () => {
    setShowPicker(false);
  };

  const hexColor = colorToHex(color);
  const sketchPicker = () => {
    return (
      <SketchPicker
        className={styles.colorPicker}
        color={hexColor}
        onChangeComplete={(curNewColor) => {
          onChange(hexToColor(curNewColor.hex));
        }}
        width="260px"
      />
    );
  };

  return (
    <div className={styles.colorSelect} onClick={() => setShowPicker(!showPicker)}>
      <div className={styles.colorBox} style={{ backgroundColor: hexColor }}></div>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {showPicker && (
          <div className={styles.popover}>
            <div className={styles.cover} onClick={closeColorPicker} />
            {sketchPicker()}
          </div>
        )}
      </div>
      <span className={styles.colorName}>{hexColor.replace("#", "# ").toUpperCase()}</span>
    </div>
  );
};

export default ColorSelectBox;
