import type { FC } from "react";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Tooltip, Button, Radio } from "antd";
import {
  AppstoreOutlined,
  UnlockFilled,
  LockFilled,
  CloseOutlined,
} from "@ant-design/icons";
import classNames from "classnames";
import chroma from "chroma-js";
import ReactSlider from "react-slider";
import { SketchPicker } from "react-color";
import {
  colorDifference,
  paletteOptimization,
  colorToHex,
} from "@antv/smart-color";
import Optimization from "../Optimization";
import type {
  CategoricalPalette,
  Color,
  DiscreteScalePalette,
  ColorValue,
  Palette,
} from "@antv/color-schema";
import styles from "./index.module.less";

type ColorDifferenceMeasure = "euclidean" | "CIEDE2000" | "contrastRatio";
const COLOR_DIFFERENCE_MEASURES: {
  measure: ColorDifferenceMeasure;
  name: string;
}[] = [
  {
    measure: "euclidean",
    name: "Euclidean Distance (La*b*)",
  },
  {
    measure: "CIEDE2000",
    name: "CIEDE2000",
  },
  {
    measure: "contrastRatio",
    name: "Contrast Ratio",
  },
];
const COLOR_DIFFERENCE_MEASURE_THRESHOLD_INFOS: Record<
  ColorDifferenceMeasure,
  { default: number; max: number; min: number }
> = {
  euclidean: {
    default: 30,
    max: 100,
    min: 10,
  },
  CIEDE2000: {
    default: 20,
    max: 60,
    min: 5,
  },
  contrastRatio: {
    default: 3,
    max: 20,
    min: 1,
  },
};

const startColor = "#D71500";
const endColor = "#FE895C";
const firstColumnWidth = "5%";

type UpdateColor = (index: number, color: ColorValue) => void;
interface DistanceMatrixProps {
  defaultThreshold?: number;
  palette: CategoricalPalette | DiscreteScalePalette;
  locked: boolean[];
  updateColor?: UpdateColor;
  updatePalette?: (palette: Palette, updateID: boolean) => void;
  lockColor: (index: number) => void;
  removeColor: (index: number) => void;
}

type PickerState = "L" | "R" | "N";

const sketchPicker = (
  color: string,
  index: number,
  setEditingColor: (color: string | undefined) => void,
  updateColor?: UpdateColor
) => {
  return (
    <SketchPicker
      className={styles.colorPicker}
      color={color}
      onChange={(newColor) => {
        setEditingColor(newColor.hex);
      }}
      onChangeComplete={(newColor) => {
        if (updateColor) {
          const { r, g, b, a = 1 } = newColor.rgb;
          updateColor(index, {
            model: "rgba",
            value: { r, g, b, a },
          });
        }
        setEditingColor(undefined);
      }}
      width={"260px"}
    />
  );
};

const MatrixCell: FC<{
  index1: number;
  index2: number;
  color1: Color;
  color2: Color;
  measure: ColorDifferenceMeasure;
  threshold: number;
  updateColor?: UpdateColor;
}> = ({ index1, index2, color1, color2, measure, threshold, updateColor }) => {
  const colorScale = chroma
    .scale([startColor, endColor])
    .domain([0, threshold]);

  const visibility = index1 !== index2;
  const difference = colorDifference(color1, color2, { measure });
  const value =
    measure === "contrastRatio"
      ? difference.toFixed(1)
      : Math.round(difference);

  const [showPicker, setShowPicker] = useState<PickerState>("N");
  const [editingColor, setEditingColor] = useState<string>();

  let matrixCellLeftWidth = 50;
  if (showPicker !== "N") {
    matrixCellLeftWidth = showPicker === "L" ? 90 : 10;
  }
  const hexColor1 = colorToHex(color1);
  const hexColor2 = colorToHex(color2);
  return (
    <div
      className={classNames(styles.matrixCell, {
        [styles.matrixCellEditing]: showPicker !== "N",
      })}
      style={{
        visibility: visibility ? "visible" : "hidden",
        background:
        visibility && value < threshold
        // @ts-ignore
            ? colorScale(value).hex()
            : "var(--main-bg-color)",
        color: value < threshold ? "white" : "var(--forth-text-color)",
      }}
    >
      {showPicker !== "N" && (
        <div className={styles.popover}>
          <div
            className={styles.cover}
            onClick={() => {
              setShowPicker("N");
            }}
          />
        </div>
      )}
      <Tooltip
        title={sketchPicker(
          editingColor || hexColor1,
          index1,
          setEditingColor,
          updateColor
        )}
        placement="bottom"
        visible={showPicker === "L"}
        color={"#ffffff"}
        overlayClassName={styles.tooltip}
      >
        <div
          className={styles.matrixCellLeft}
          style={{
            background:
              showPicker === "L" ? editingColor || hexColor1 : hexColor1,
            width: `${matrixCellLeftWidth}%`,
          }}
          onClick={() => setShowPicker("L")}
        ></div>
      </Tooltip>
      <Tooltip
        title={sketchPicker(
          editingColor || hexColor2,
          index2,
          setEditingColor,
          updateColor
        )}
        placement="bottom"
        visible={showPicker === "R"}
        color={"#ffffff"}
        overlayClassName={styles.tooltip}
      >
        <div
          className={styles.matrixCellRight}
          style={{
            background:
              showPicker === "R" ? editingColor || hexColor2 : hexColor2,
            width: `${100 - matrixCellLeftWidth}%`,
          }}
          onClick={() => setShowPicker("R")}
        ></div>
      </Tooltip>
      <div className={styles.matrixCellText}> {value} </div>
    </div>
  );
};

const MatrixRow: FC<{
  index: number;
  colors: Color[];
  threshold: number;
  measure: ColorDifferenceMeasure;
  updateColor?: UpdateColor;
}> = ({ index, colors, measure, threshold, updateColor }) => {
  const color = colors[index];
  return (
    <div className={styles.matrixRow}>
      <div style={{ background: colorToHex(color), width: firstColumnWidth }} />
      {colors.map((color2, index2) => (
        <MatrixCell
          key={color2.id || colorToHex(color2)}
          index1={index}
          index2={index2}
          color1={colors[index]}
          color2={colors[index2]}
          measure={measure}
          threshold={threshold}
          updateColor={updateColor}
        ></MatrixCell>
      ))}
    </div>
  );
};

const DistanceMatrix: FC<DistanceMatrixProps> = ({
  defaultThreshold = 30,
  palette,
  locked,
  updateColor,
  updatePalette,
  lockColor,
  removeColor,
}) => {
  const { formatMessage } = useIntl();
  const [threshold, setThreshold] = useState<number>(defaultThreshold);
  const [differenceMeasure, setDifferenceMeasure] =
    useState<ColorDifferenceMeasure>("euclidean");
  const { colors } = palette;

  const onDifferenceMeasureChange = (event: any) => {
    const measure = event.target.value as ColorDifferenceMeasure;
    setDifferenceMeasure(measure);
    setThreshold(COLOR_DIFFERENCE_MEASURE_THRESHOLD_INFOS[measure].default);
  };

  return (
    <>
      <Radio.Group
        value={differenceMeasure}
        className={styles.distanceMeasure}
        onChange={onDifferenceMeasureChange}
      >
        {COLOR_DIFFERENCE_MEASURES.map(({ measure, name }) => (
          <Radio.Button value={measure} key={measure}>
            {formatMessage({ id: name })}
          </Radio.Button>
        ))}
      </Radio.Group>
      <div className={styles.distanceMatrixContainer}>
        <div className={styles.distanceMatrix}>
          {/* header */}
          <div className={styles.matrixRow}>
            <div
              style={{ width: firstColumnWidth }}
              className={styles.matrixLogo}
            >
              <AppstoreOutlined />
            </div>
            {colors.map((color, index) => (
              <div
                key={color.id || colorToHex(color)}
                className={styles.matrixCell}
                style={{ background: colorToHex(color) }}
              >
                <div className={styles.btns}>
                  {locked[index] ? (
                    <Button
                      shape="circle"
                      icon={<LockFilled />}
                      onClick={() => lockColor(index)}
                    />
                  ) : (
                    <>
                      <Button
                        shape="circle"
                        icon={<UnlockFilled />}
                        onClick={() => lockColor(index)}
                        className={styles.hoverShow}
                      />
                      <Button
                        shape="circle"
                        icon={<CloseOutlined />}
                        onClick={() => removeColor(index)}
                        className={styles.hoverShow}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {colors.map((color, index1) => (
            <MatrixRow
              index={index1}
              key={color.id || colorToHex(color)}
              colors={colors}
              measure={differenceMeasure}
              threshold={threshold}
              updateColor={updateColor}
            ></MatrixRow>
          ))}
        </div>

        <ReactSlider
          className={styles.thresholdSlider}
          thumbClassName={styles.thresholdSliderThumb}
          trackClassName={styles.thresholdSliderTrack}
          orientation="vertical"
          value={threshold}
          max={COLOR_DIFFERENCE_MEASURE_THRESHOLD_INFOS[differenceMeasure].max}
          min={COLOR_DIFFERENCE_MEASURE_THRESHOLD_INFOS[differenceMeasure].min}
          onChange={(value) => setThreshold(value)}
          renderThumb={(props: any, state: any) => (
            <Tooltip
              key={differenceMeasure}
              placement="right"
              title={formatMessage(
                {
                  id: "Color discrimination threshold, generally take the value of {value}, can be better differentiation, suitable for all kinds of visualization scenes.",
                },
                {
                  value:
                    COLOR_DIFFERENCE_MEASURE_THRESHOLD_INFOS[differenceMeasure]
                      .default,
                }
              )}
            >
              <div {...props}>{state.valueNow}</div>
            </Tooltip>
          )}
        />
      </div>
      <Optimization
        optimize={() =>
          updatePalette &&
          updatePalette(
            paletteOptimization(palette, {
              locked,
              simulationType: "normal",
              threshold,
              colorDifferenceMeasure: differenceMeasure,
            }),
            false
          )
        }
      />
    </>
  );
};

export default DistanceMatrix;
