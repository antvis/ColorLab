import React, { FC, useState, useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import chroma from 'chroma-js';
import { ColorModelRange } from '@antv/color-schema';
import { Radio } from 'antd';
import { getHexColors } from '@/util';
import type { CategoricalPalette, DiscreteScalePalette, ColorModel } from '@antv/color-schema';
import styles from './index.less';

interface ColorModelProps {
  palette: CategoricalPalette | DiscreteScalePalette;
  theme: string;
}
const COLOR_MODELS: ColorModel[] = ['hsl', 'hsv', 'hsi', 'rgb', 'lab', 'lch'];

const SCATTER_PLOT_LAYOUT = {
  margin: {
    l: 50,
    r: 30,
    t: 30,
    b: 50,
  },
};

const SCATTER_PLOT_MARKER = {
  size: 16,
  opacity: 1,
};

const SCATTER_PLOT_LINE = {
  color: 'rgba(125,125,125,0.3)',
  size: 1,
};

function generateTwoDimensions(colorModel: ColorModel) {
  const letters = colorModel.split('');
  const set = new Set<string>();
  for (let i = 0; i < letters.length; i += 1) {
    for (let j = 0; j < letters.length; j += 1) {
      const a = letters[i];
      const b = letters[j];
      if (a !== b) {
        const key = `${a}${b}`;
        set.add(key);
      }
    }
  }
  return Array.from(set).sort();
}

function draw3dScatter(containerID: string, colors: string[], colorModel: ColorModel, style: {}) {
  const [d1, d2, d3] = colorModel.split('');

  const x: number[] = [];
  const y: number[] = [];
  const z: number[] = [];

  colors.forEach((color) => {
    const components = chroma(color)[colorModel]();
    x.push(+components[0]);
    y.push(+components[1]);
    z.push(+components[2]);
  });

  const trace = {
    x,
    y,
    z,
    mode: 'lines+markers',
    type: 'scatter3d',
    marker: {
      color: colors,
      ...SCATTER_PLOT_MARKER,
      size: 8,
    },
    line: SCATTER_PLOT_LINE,
  };
  const data = [trace];
  const layout = {
    scene: {
      aspectmode: 'cube',
      xaxis: { title: d1.toUpperCase(), range: ColorModelRange[colorModel][d1] },
      yaxis: { title: d2.toUpperCase(), range: ColorModelRange[colorModel][d2] },
      zaxis: { title: d3.toUpperCase(), range: ColorModelRange[colorModel][d3] },
    },
    margin: {
      l: 0,
      r: 0,
      t: 0,
      b: 0,
    },
    ...style,
  };

  Plotly.purge(containerID);
  Plotly.newPlot(containerID, data, layout);
}

function draw2dPlot(containerID: string, colors: string[], colorModel: ColorModel, twoDimension: string, style: {}) {
  const [d1, d2] = twoDimension.split('');

  const x: number[] = [];
  const y: number[] = [];

  colors.forEach((color) => {
    const components = chroma(color)[colorModel]();
    x.push(+components[colorModel.indexOf(d1)]);
    y.push(+components[colorModel.indexOf(d2)]);
  });

  const trace = {
    x,
    y,
    mode: 'lines+markers',
    type: 'scatter',
    marker: {
      color: colors,
      ...SCATTER_PLOT_MARKER,
    },
    line: SCATTER_PLOT_LINE,
  };
  const layout = {
    xaxis: {
      title: d1.toUpperCase(),
      range: ColorModelRange[colorModel][d1],
    },
    yaxis: {
      title: d2.toUpperCase(),
      range: ColorModelRange[colorModel][d2],
    },
    ...SCATTER_PLOT_LAYOUT,
    ...style,
  };
  Plotly.purge(containerID);
  Plotly.newPlot(containerID, [trace], layout);
}

function draw1dPlot(containerID: string, colors: string[], colorModel: ColorModel, oneDimension: string, style: {}) {
  const [d1] = oneDimension.split('');
  const x: string[] = [];
  const y: number[] = [];

  colors.forEach((color, i) => {
    const components = chroma(color)[colorModel]();
    x.push(`${i}`);
    y.push(+components[colorModel.indexOf(oneDimension)]);
  });

  const trace = {
    x,
    y,
    mode: 'lines+markers',
    type: 'scatter',
    marker: {
      color: colors,
      ...SCATTER_PLOT_MARKER,
    },
    line: SCATTER_PLOT_LINE,
  };
  const layout = {
    xaxis: {
      title: 'index',
    },
    yaxis: {
      title: d1.toUpperCase(),
      range: ColorModelRange[colorModel][d1],
    },
    ...SCATTER_PLOT_LAYOUT,
    ...style,
  };
  Plotly.purge(containerID);
  Plotly.newPlot(containerID, [trace], layout);
}

const ColorModelView: FC<ColorModelProps> = ({ palette, theme }) => {
  const [threeDimension, setThreeDimension] = useState<ColorModel>('hsv');
  const twoDimensions = generateTwoDimensions(threeDimension);
  const oneDimensions = threeDimension.split('');
  const [twoDimension, setTwoDimension] = useState<string>(twoDimensions[0]);
  const [oneDimension, setOneDimension] = useState<string>(oneDimensions[0]);

  useEffect(() => {
    const colors = getHexColors(palette);

    const bg = theme === 'dark' ? '#151515' : '#fff';
    const style = {
      paper_bgcolor: bg,
      plot_bgcolor: bg,
    };

    draw3dScatter('3dScatterPlot', colors, threeDimension, style);
    draw2dPlot('2dScatterPlot', colors, threeDimension, twoDimension, style);
    draw1dPlot('1dScatterPlot', colors, threeDimension, oneDimension, style);
  }, [palette, theme, oneDimension, twoDimension, threeDimension]);

  const changeThreeDimension = (colorModel: ColorModel) => {
    const twoD = generateTwoDimensions(colorModel);
    const oneD = colorModel.split('');
    setThreeDimension(colorModel);
    setTwoDimension(twoD[0]);
    setOneDimension(oneD[0]);
  };

  return (
    <>
      <div className={styles.colorModelContainer}>
        <div className={styles.scatterPlotContainer}>
          <div className={styles.toolbar}>
            <span>Y: </span>
            <Radio.Group
              className={styles.radioGroup}
              options={oneDimensions.map((value) => ({ label: value, value }))}
              onChange={(e) => setOneDimension(e.target.value)}
              value={oneDimension}
              optionType="button"
              buttonStyle="solid"
            />
          </div>
          <div id="1dScatterPlot" className={styles.scatterPlot}></div>
        </div>
        <div className={styles.scatterPlotContainer}>
          <div className={styles.toolbar}>
            <span>XY:</span>
            <Radio.Group
              className={styles.radioGroup}
              options={twoDimensions.map((value) => ({ label: value, value }))}
              onChange={(e) => setTwoDimension(e.target.value)}
              value={twoDimension}
              optionType="button"
              buttonStyle="solid"
            />
          </div>
          <div id="2dScatterPlot" className={styles.scatterPlot}></div>
        </div>
        <div className={styles.scatterPlotContainer}>
          <div className={styles.toolbar}>
            <span>XYZ:</span>
            <Radio.Group
              className={styles.radioGroup}
              options={COLOR_MODELS.map((value) => ({ label: value, value }))}
              onChange={(e) => changeThreeDimension(e.target.value)}
              value={threeDimension}
              optionType="button"
              buttonStyle="solid"
            />
          </div>
          <div id="3dScatterPlot" className={styles.scatterPlot}></div>
        </div>
      </div>
    </>
  );
};

export default ColorModelView;
