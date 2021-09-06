import type { FC, CSSProperties } from 'react';
import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import NoSSR from 'react-no-ssr';
import chroma from 'chroma-js';
import { colorToHex } from '@antv/color-schema';
import { ColorBar } from './ColorBar';
import type { SimulationType } from '@antv/smart-color';
import type { CategoricalPalette, DiscreteScalePalette, ColorValue } from '@antv/color-schema';
import type { ColorBarSizeType } from './ColorBar';
import styles from './index.less';

interface ColorBarsProps {
  palette: CategoricalPalette | DiscreteScalePalette;
  locked: boolean[];
  height?: string | number;
  simulationType?: SimulationType;
  size?: ColorBarSizeType;
  addColor: (index: number, color: ColorValue) => string;
  updateColor: (index: number, color: ColorValue) => void;
  removeColor: (index: number) => void;
  reorderColor: (source: number, destination: number) => void;
  lockColor: (index: number) => void;
}

const ColorBars: FC<ColorBarsProps> = ({
  palette,
  locked,
  height = '100%',
  simulationType = 'normal',
  size = 'large',
  addColor,
  updateColor,
  removeColor,
  reorderColor,
  lockColor,
}) => {
  const { colors } = palette;
  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    // reorder color
    const { destination, source } = result;
    reorderColor(source.index, destination.index);
  };

  const addNewColor = (index: number) => {
    let color;
    if (index === 0) {
      color = chroma(colorToHex(colors[0])).darken().rgba();
    } else if (index === colors.length) {
      color = chroma(colorToHex(colors[index - 1]))
        .brighten()
        .rgba();
    } else {
      color = chroma.mix(colorToHex(colors[index - 1]), colorToHex(colors[index])).rgba();
    }
    const [r, g, b, a] = color;
    addColor(index, {
      model: 'rgba',
      value: {
        r,
        g,
        b,
        a,
      },
    });
  };

  const AddColorButton = (props: { index: number; style?: CSSProperties }) => {
    return (
      <Button
        type="text"
        className={styles.addColor}
        icon={<PlusOutlined />}
        style={props.style}
        onClick={() => addNewColor(props.index)}
      ></Button>
    );
  };
  const isSmall = size === 'small';
  const addColorButtonStyle = isSmall
    ? {
        height: '32px',
        borderRadius: '50%',
        top: `calc(${height}/2 - 16px)`,
      }
    : {};
  return (
    <>
      <NoSSR>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided: any) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: 'flex', height }}>
                {colors.map((color, i) => (
                  <ColorBar
                    key={color.id || colorToHex(color)}
                    color={color}
                    index={i}
                    locked={locked[i]}
                    simulationType={simulationType}
                    updateColor={(newColor: ColorValue) => updateColor(i, newColor)}
                    removeColor={() => removeColor(i)}
                    lockColor={() => lockColor(i)}
                    showColorPicker={false}
                    size={size}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </NoSSR>
      <div className={styles.addColorList}>
        {colors.map((color, i) => (
          <AddColorButton
            key={color.id || colorToHex(color)}
            index={i}
            style={{
              left: `${(i / colors.length) * 100}%`,
              height,
              ...addColorButtonStyle,
            }}
          />
        ))}
        <AddColorButton
          key={'last'}
          index={colors.length}
          style={{
            height: isSmall ? 'auto' : height,
            ...addColorButtonStyle,
          }}
        />
      </div>
    </>
  );
};

export default ColorBars;
