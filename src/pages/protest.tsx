import classNames from "classnames";
import { isContinuousPalette, isMatrixPalette } from "@antv/color-schema";
import DistanceMatrix from "@/components/DistanceMatrix";
import ColorModel from "@/components/ColorModel";
import type { ProtestType } from "@/consts/protestInfo";
import { useOutletContext } from "react-router-dom";
import { useThemeContext } from "@/contexts/theme";
import { useCurrentPaletteContext } from "@/contexts/currentPalette";
import styles from "./index.module.less";

const Protest = () => {
  const { type } = useOutletContext<{ type: ProtestType }>();

  const {
    currentPalette,
    locked,
    updateColor,
    lockColor,
    removeColor,
    setCurrentPalette,
  } = useCurrentPaletteContext();
  const { theme } = useThemeContext();
  let content = <></>;
  if (
    !isContinuousPalette(currentPalette) &&
    !isMatrixPalette(currentPalette)
  ) {
    switch (type) {
      case "distanceMatrix":
        content = (
          <DistanceMatrix
            defaultThreshold={30}
            palette={currentPalette}
            locked={locked}
            updateColor={updateColor}
            lockColor={lockColor}
            removeColor={removeColor}
            updatePalette={setCurrentPalette}
          />
        );
        break;
      case "colorModel":
        content = (
          <ColorModel palette={currentPalette} theme={theme}></ColorModel>
        );
        break;
      default:
        break;
    }
  }

  return (
    <div className={classNames(styles.container, styles.protest)}>
      {content}
    </div>
  );
};

export default Protest;
