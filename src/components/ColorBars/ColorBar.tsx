import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Tooltip, Button } from 'antd';
import { EditOutlined, UnlockFilled, LockFilled, CloseOutlined } from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import classNames from 'classnames';
import { invertGrayscale, colorSimulation, colorToGray, colorToHex } from '@antv/smart-color';
import { copyToClipboard } from '../../util';
import type { ColorValue, Color } from '@antv/color-schema';
import type { SimulationType } from '@antv/smart-color';
import styles from "./index.module.less";

export type ColorBarSizeType = 'small' | 'large';

interface ColorBarProps {
  color: Color;
  index: number;
  locked?: boolean;
  updateColor?: (color: ColorValue) => void;
  removeColor?: () => void;
  lockColor?: () => void;
  simulationType?: SimulationType;
  showColorPicker?: boolean;
  size?: ColorBarSizeType;
}

export const ColorBar: FC<ColorBarProps> = ({
  color,
  index,
  locked = false,
  updateColor,
  removeColor = () => {},
  lockColor = () => {},
  simulationType = 'normal',
  showColorPicker = false,
  size = 'large',
}) => {
  const [showBtns, setShowBtns] = useState<boolean>(false);
  const [showPicker, setShowPicker] = useState<boolean>(showColorPicker);
  const [editingColor, setEditingColor] = useState<string>();

  useEffect(() => {
    if (showColorPicker) {
      setShowPicker(showColorPicker);
    }
  }, [showColorPicker]);

  const closeColorPicker = () => {
    setShowBtns(false);
    setShowPicker(false);
  };

  const invert = (grayscale: number) => {
    const newColor = invertGrayscale(grayscale, color);
    if (updateColor) {
      updateColor(newColor);
    }
  };

  const buttons = (
    <div className={styles.btns}>
      <Button shape="circle" icon={<EditOutlined />} onClick={() => setShowPicker(!showColorPicker)} />

      <Button shape="circle" icon={<UnlockFilled />} onClick={lockColor} />

      <Button shape="circle" icon={<CloseOutlined />} onClick={removeColor} />
    </div>
  );

  const isLarge = size === 'large';
  const simulated = simulationType !== 'normal';
  const isGrayscale = simulationType === 'grayscale';
  const simulationResult = simulated ? colorSimulation(color, simulationType) : null;
  let simulationResultName = '';
  if (simulationResult) {
    if (isGrayscale) {
      const gray = colorToGray(simulationResult);
      simulationResultName = `${Math.round((gray / 255) * 100)}%`;
    } else {
      simulationResultName = colorToHex(simulationResult).replace('#', '');
    }
  }

  const height = simulated ? '50%' : '100%';

  const hexColor = colorToHex(color);
  const sketchPicker = (
    <SketchPicker
      className={styles.colorPicker}
      color={editingColor || hexColor}
      onChange={(newColor) => {
        setEditingColor(newColor.hex);
      }}
      onChangeComplete={(newColor) => {
        if (updateColor) {
          const { r, g, b, a = 1 } = newColor.rgb;
          updateColor({
            model: 'rgba',
            value: { r, g, b, a },
          });
        }
        setEditingColor(undefined);
      }}
      width={'260px'}
    />
  );

  const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    width: '100%',
    ...draggableStyle,
  });

  const colorBarContent = (
    <Draggable draggableId={color.id || colorToHex(color)} index={index} isDragDisabled={!!editingColor}>
      {(provided: any, snapshot: any) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
          className={styles.colorBarContainer}
        >
          <div className={styles.colorBar}>
            <div
              className={styles.color}
              style={{
                backgroundColor: editingColor || hexColor,
                height,
              }}
              onMouseMove={() => {
                setShowBtns(true);
              }}
              onMouseLeave={() => {
                setShowBtns(false);
              }}
              onClick={() => {
                copyToClipboard(hexColor);
              }}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {showPicker && (
                  <div className={styles.popover}>
                    <div
                      className={styles.cover}
                      onClick={closeColorPicker}
                      onDrag={(event) => {
                        event.stopPropagation();
                      }}
                    />
                    {isLarge && sketchPicker}
                  </div>
                )}
                {locked ? (
                  <div className={styles.btns}>
                    <Button shape="circle" icon={<LockFilled />} onClick={lockColor} />
                  </div>
                ) : (
                  <>{showBtns && buttons}</>
                )}
                <span className={styles.colorName}>{hexColor.replace('#', '').toUpperCase()}</span>
              </div>
            </div>
            {/* simulation color bar */}
            {simulated && (
              <div
                className={classNames(styles.color, {
                  [styles.colorGrayscale]: isGrayscale,
                })}
                style={{
                  backgroundColor: simulationResult ? colorToHex(simulationResult) : 'initial',
                  height,
                }}
                onClick={() => {
                  if (simulationResult) {
                    copyToClipboard(colorToHex(simulationResult));
                  }
                }}
              >
                {isGrayscale && (
                  <div
                    className={classNames(styles.gradientBar, {
                      [styles.gradientBarVertical]: isLarge,
                    })}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {new Array(20).fill(0).map((d, i) => (
                      <div
                        key={i}
                        className={styles.gradientBlock}
                        style={{
                          background: `rgb(${((20 - i) / 20) * 255}, ${((20 - i) / 20) * 255}, ${
                            ((20 - i) / 20) * 255
                          })`,
                        }}
                        onClick={() => invert((20 - i) / 20)}
                      >
                        {simulationResult &&
                          parseFloat(simulationResultName) > ((19 - i) / 20) * 100 &&
                          parseFloat(simulationResultName) <= ((20 - i) / 20) * 100 && (
                            <span>{simulationResultName}</span>
                          )}
                      </div>
                    ))}
                  </div>
                )}
                <span className={styles.colorName}>{simulationResultName.toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );

  return isLarge ? (
    colorBarContent
  ) : (
    <Tooltip
      title={sketchPicker}
      placement="bottom"
      visible={showPicker}
      color={'#ffffff'}
      overlayClassName={styles.tooltip}
    >
      {colorBarContent}
    </Tooltip>
  );
};
