import { isContinuousPalette, isMatrixPalette } from "@antv/color-schema";
import { paletteOptimization } from "@antv/smart-color";
import ColorBars from "../components/ColorBars";
import { useSimulationTypeContext } from "@/contexts/simulationType";
import Optimization from "../components/Optimization";
import { useCurrentPaletteContext } from "@/contexts/currentPalette";

const Pure = () => {
  const {
    currentPalette,
    locked,
    addColor,
    removeColor,
    updateColor,
    reorderColor,
    lockColor,
    setCurrentPalette,
  } = useCurrentPaletteContext();
  const { simulationType } = useSimulationTypeContext();
  const isNormal = simulationType === "normal";

  const height = isNormal ? "100%" : "calc(100% - 70px)";
  if (
    !isContinuousPalette(currentPalette) &&
    !isMatrixPalette(currentPalette)
  ) {
    return (
      <>
        <ColorBars
          palette={currentPalette}
          locked={locked}
          height={height}
          simulationType={simulationType}
          addColor={addColor}
          removeColor={removeColor}
          updateColor={updateColor}
          reorderColor={reorderColor}
          lockColor={lockColor}
        />
        {!isNormal && (
          <Optimization
            style={{ marginLeft: "20px" }}
            optimize={() =>
              setCurrentPalette(
                paletteOptimization(currentPalette, {
                  locked,
                  simulationType,
                }),
                false
              )
            }
          ></Optimization>
        )}
      </>
    );
  }
  return <></>;
};

export default Pure;
