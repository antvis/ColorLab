import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { Button, Select } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { isContinuousPalette, isMatrixPalette } from "@antv/color-schema";
import { paletteOptimization } from "@antv/smart-color";
import ColorBars from "@/components/ColorBars";
import Optimization from "@/components/Optimization";
import Dashboard from "@/components/Dashboard";
import DASHBOARDS from "@/consts/dashboards";
import { useThemeContext } from "@/contexts/theme";
import { useSimulationTypeContext } from "@/contexts/simulationType";
import { useCurrentPaletteContext } from "@/contexts/currentPalette";
import styles from "./index.module.less";

const { Option } = Select;

const Preview = () => {
  const { formatMessage } = useIntl();
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
  const { theme } = useThemeContext();
  const isNormal = simulationType === "normal";
  const fitDashboards = DASHBOARDS.filter(
    (dashboard) => dashboard.type === currentPalette.type
  );
  const defaultDashboardName = fitDashboards[0].name;
  const [dashboardName, setDashboardName] =
    useState<string>(defaultDashboardName);
  const height = isNormal ? "100px" : "170px";

  const handleDashboardChange = (value: string) => {
    setDashboardName(value);
  };

  useEffect(() => {
    if (!fitDashboards.find((dashboard) => dashboard.name === dashboardName)) {
      setDashboardName(defaultDashboardName);
    }
  }, [currentPalette]);

  if (
    !isContinuousPalette(currentPalette) &&
    !isMatrixPalette(currentPalette)
  ) {
    return (
      <div className={classNames(styles.container, styles.preview)}>
        <div className={styles.header}>
          <ColorBars
            palette={currentPalette}
            locked={locked}
            height={height}
            simulationType={simulationType}
            size={"small"}
            addColor={addColor}
            removeColor={removeColor}
            updateColor={updateColor}
            reorderColor={reorderColor}
            lockColor={lockColor}
          />
          {!isNormal && (
            <Optimization
              style={{ marginLeft: "20px", marginTop: "10px" }}
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
          <div className={styles.dashboardConfigPanel}>
            <Select
              value={dashboardName}
              style={{ width: 120 }}
              onChange={handleDashboardChange}
            >
              {fitDashboards.map((dashboard) => (
                <Option value={dashboard.name} key={dashboard.name}>
                  {dashboard.name}
                </Option>
              ))}
            </Select>
            <Button icon={<DownloadOutlined />} className={styles.exportKit}>
              {formatMessage({ id: "Export Kit" })}
            </Button>
          </div>
        </div>
        <div
          className={styles.content}
          style={{
            height: isNormal ? "calc(100% - 165px)" : "calc(100% - 275px)",
          }}
        >
          <Dashboard
            dashborad={fitDashboards.find(
              (dashboard) => dashboard.name === dashboardName
            )}
            palette={currentPalette}
            simulationType={simulationType}
            theme={theme === "dark" ? "dark" : "default"}
          ></Dashboard>
        </div>
      </div>
    );
  }
  return <></>;
};

export default Preview;
