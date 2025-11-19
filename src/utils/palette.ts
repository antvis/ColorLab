import { isContinuousPalette, isMatrixPalette } from "@antv/color-schema";
import { colorToHex, colorSimulation } from "@antv/smart-color";
import type { Color, Palette } from "@antv/color-schema";
import type { SimulationType } from "@antv/smart-color";

export function getHexColors(palette: Palette): string[] {
  if (!isContinuousPalette(palette) && !isMatrixPalette(palette)) {
    return palette.colors.map((color: Color) => colorToHex(color));
  }
  return [];
}

export function getSimulationColors(
  palette: Palette,
  type: SimulationType
): string[] {
  if (!isContinuousPalette(palette) && !isMatrixPalette(palette)) {
    return palette.colors.map((color: Color) =>
      colorToHex(colorSimulation(color, type))
    );
  }
  return [];
}
