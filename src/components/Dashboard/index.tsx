import type { FC } from 'react';
import React, { useEffect, useRef } from 'react';
import { Col, Row } from 'antd';
import * as G2Plot from '@antv/g2plot';
import { getHexColors, getSimulationColors } from '@/utils';
import type { Palette } from '@antv/color-schema';
import type { SimulationType } from '@antv/smart-color';
import type { DashBoard } from '@/types/dashboard';
import styles from './index.module.less';

interface DashboardProps {
  dashborad?: DashBoard;
  palette: Palette;
  simulationType?: SimulationType;
  theme?: string;
}

const Dashboard: FC<DashboardProps> = ({ dashborad, palette, simulationType = 'normal', theme = 'default' }) => {
  const { current: plots } = useRef(new Map());

  const chartContainerId = (id: string) => {
    return `chartContainer-${id}`;
  };
  const color = simulationType === 'normal' ? getHexColors(palette) : getSimulationColors(palette, simulationType);

  useEffect(() => {
    plots.clear();
    if (dashborad) {
      const { charts } = dashborad;
      charts.forEach((chart) => {
        fetch(chart.data)
          .then((res) => res.json())
          .then((data) => {
            const plot = new G2Plot[chart.type](chartContainerId(chart.id), {
              data,
              theme,
              color,
              animation: false,
              ...chart.config,
            });
            plots.set(chart.id, plot);
            plot.render();
          });
      });
    }
    return function cleanup() {
      plots.forEach((plot, id) => {
        plot.destroy();
        plots.delete(id);
      });
    };
  }, [dashborad, theme]);

  useEffect(() => {
    if (dashborad && palette) {
      const { charts } = dashborad;
      charts.forEach((chart) => {
        const plot = plots.get(chart.id);
        if (plot) {
          plot.update({
            color,
          });
        }
      });
    }
  }, [palette, simulationType]);

  return (
    <>
      {dashborad ? (
        <Row className={styles.dashboardContainer}>
          {dashborad.charts.map((chart) => (
            <Col key={chart.id} className={styles.chartContainer} span={chart.span || 12}>
              <div id={chartContainerId(chart.id)}></div>
            </Col>
          ))}
        </Row>
      ) : null}
    </>
  );
};

export default Dashboard;
