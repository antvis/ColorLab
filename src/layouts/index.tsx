import { useState } from "react";
import { Layout, Menu, Button, Space, Divider, Dropdown, Radio } from "antd";
import { useIntl } from "react-intl";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useLocaleContext } from "@/locales/context";
import {
  DownloadOutlined,
  RollbackOutlined,
  RetweetOutlined,
  BulbOutlined,
  CloseOutlined,
  FolderOpenOutlined,
  TranslationOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import { isContinuousPalette, isMatrixPalette } from "@antv/color-schema";
import { paletteGeneration } from "@antv/smart-color";
import { GITHUB_URL } from "@/constants";
import {
  PaletteIcon,
  LayoutIcon,
  ControlIcon,
  GlassesIcon,
  ContrastIcon,
  SaveIcon,
} from "@/components/icons";
import Assets from "@/components/Assets";
import COLOR_BLINDNESS_SIMULATION_INFOS from "@/constants/colorBlindnessSimulationInfos";
import PaletteConfigSider from "@/components/PaletteConfigSider";
import ExportPaletteModal from "@/components/Modal/ExportPaletteModal";
import { PROTEST_INFOS } from "@/constants/protestInfo";
import { useColorSchemeInfoContext } from "@/contexts/colorSchemeInfo";
import { useThemeContext } from "@/contexts/theme";
import { useSimulationTypeContext } from "@/contexts/simulationType";
import { usePaletteConfigContext } from "@/contexts/paletteConfig";
import styles from "./index.module.less";
import { usePaletteConfigCollapsedContext } from "@/contexts/paletteConfigCollapsed";
import { useMyAssetsContext } from "@/contexts/myAssets";
import { useCurrentPaletteContext } from "@/contexts/currentPalette";

const { Content, Sider } = Layout;
const LANGUAGES = ["en-US", "zh-CN"] as const;
type Languages = (typeof LANGUAGES)[number];
const LANGUAGE_NAME: Record<Languages, string> = {
  "en-US": "English",
  "zh-CN": "简体中文",
};

const Layouts = () => {
  const { pathname } = useLocation();
  const { formatMessage } = useIntl();
  const { setLocale } = useLocaleContext();
  const { simulationType, setSimulationType } = useSimulationTypeContext();
  const { theme, setTheme } = useThemeContext();
  const {
    currentPalette,
    locked,
    setCurrentPalette,
    canUndo,
    canRedo,
    redo,
    undo,
  } = useCurrentPaletteContext();
  const { paletteConfig } = usePaletteConfigContext();
  const { myAssets, savePalette } = useMyAssetsContext();
  const isGrayscale = simulationType === "grayscale";
  const isBlindSimulation = simulationType !== "normal" && !isGrayscale;
  const isProtest = pathname === "/protest";

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [currentProtestType, setCurrentProtestType] = useState(
    PROTEST_INFOS[0].type,
  );
  const { colorSchemeInfo } = useColorSchemeInfoContext();
  const { setPaletteConfigCollapsed } = usePaletteConfigCollapsedContext();

  const handleExportCancel = () => {
    setIsExporting(false);
  };

  const save = () => {
    if (currentPalette !== myAssets.palettes[myAssets.palettes.length - 1]) {
      savePalette(currentPalette);
    }
  };

  const regeneratePalette = () => {
    if (
      !isContinuousPalette(currentPalette) &&
      !isMatrixPalette(currentPalette)
    ) {
      const palette = paletteGeneration(colorSchemeInfo.type, {
        colors: currentPalette.colors.map((color, i) =>
          locked[i] ? color : undefined,
        ),
        ...paletteConfig,
      });
      setCurrentPalette(palette, true, false);
    }
  };

  const protestMenu = (
    <Radio.Group
      className={styles.protestMenu}
      defaultValue={currentProtestType}
      onChange={(e) => setCurrentProtestType(e.target.value)}
    >
      {PROTEST_INFOS.map((info) => (
        <Radio.Button
          key={info.type}
          value={info.type}
          className={styles.protestMenuItem}
        >
          {formatMessage({ id: info.name })}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
  const handleSiderOpenButton = () => {
    setCollapsed(false);
    setPaletteConfigCollapsed(true);
  };

  const blindSimulationMenu = (
    <Menu className={styles.dropdownMenu}>
      {COLOR_BLINDNESS_SIMULATION_INFOS.map((simulation) => (
        <Menu.Item
          key={simulation.type}
          onClick={() => setSimulationType(simulation.type)}
          className={styles.menuItem}
        >
          <p className={styles.itemName}>
            {formatMessage({ id: simulation.name })}
          </p>
          <small className={styles.itemDescription}>
            {formatMessage({ id: simulation.description })}
          </small>
        </Menu.Item>
      ))}
    </Menu>
  );

  const languageMenu = (
    <Menu className={styles.dropdownMenu}>
      {LANGUAGES.map((lang: Languages) => (
        <Menu.Item
          key={lang}
          onClick={() => setLocale(lang)}
          className={styles.menuItem}
        >
          {LANGUAGE_NAME[lang]}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Layout className={styles.layout}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Link to="/">
            <img
              src="https://gw.alipayobjects.com/zos/antfincdn/AbQVG%266cTw/logo.svg"
              alt=""
            />
          </Link>
        </div>

        <div className={styles.menu}>
          <Menu mode="horizontal" defaultSelectedKeys={[pathname]}>
            <Menu.Item key="/pure" icon={<PaletteIcon />}>
              <Link to="/pure">{formatMessage({ id: "Pure Mode" })}</Link>
            </Menu.Item>
            <Menu.Item key="/" icon={<LayoutIcon />}>
              <Link to="/">{formatMessage({ id: "Preview Mode" })}</Link>
            </Menu.Item>
            <Menu.Item key="/protest" icon={<ControlIcon />}>
              <Link to="/protest">
                {formatMessage({ id: "Professional Test" })}
              </Link>
            </Menu.Item>
          </Menu>
        </div>

        <div className={styles.toolbar}>
          <Button
            type="link"
            href="https://www.yuque.com/colorlab/ngdsbg"
            target="_blank"
            className={styles.toolbarItem}
          >
            {formatMessage({ id: "Instruction" })}
          </Button>
          <Button
            type="link"
            href="https://www.yuque.com/colorlab/ehwolf"
            target="_blank"
            className={styles.toolbarItem}
          >
            {formatMessage({ id: "Color Knowledge" })}
          </Button>
          <Dropdown overlay={languageMenu}>
            <Button
              className={styles.toolbarButton}
              icon={<TranslationOutlined />}
            />
          </Dropdown>
          <Button
            className={styles.toolbarButton}
            icon={<BulbOutlined />}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          />
          <Button
            className={styles.toolbarButton}
            icon={<GithubOutlined />}
            onClick={() => {
              window.open(GITHUB_URL, "_blank", "noopener,noreferrer");
            }}
          />
        </div>
      </div>
      <Layout className={styles.content}>
        <Sider
          theme="light"
          width={320}
          className={styles.sider}
          collapsible
          trigger={null}
          collapsed={collapsed}
        >
          <Assets collapsed={collapsed} />
          {!collapsed ? (
            <Button
              icon={<CloseOutlined />}
              className={styles.siderCloseButton}
              onClick={() => setCollapsed(true)}
            />
          ) : (
            <Button
              icon={<FolderOpenOutlined />}
              className={styles.siderOpenButton}
              onClick={() => handleSiderOpenButton()}
            />
          )}
        </Sider>

        <PaletteConfigSider colorSchemeInfo={colorSchemeInfo} />

        <Layout className={styles.panelContainer}>
          <div className={styles.subHeader}>
            {isProtest ? (
              protestMenu
            ) : (
              <>
                <Button
                  type="link"
                  icon={<RetweetOutlined />}
                  onClick={regeneratePalette}
                >
                  {formatMessage({ id: "Change" })}
                </Button>
                <Dropdown overlay={blindSimulationMenu}>
                  <Button
                    type={isBlindSimulation ? "link" : "text"}
                    icon={<GlassesIcon />}
                    className={styles.dropdownButton}
                  >
                    {isBlindSimulation
                      ? formatMessage({
                          id: COLOR_BLINDNESS_SIMULATION_INFOS.find(
                            (simulation) => simulation.type === simulationType,
                          )?.name,
                        })
                      : formatMessage({
                          id: "Color Blindness Simulation",
                        })}
                  </Button>
                </Dropdown>
                <Divider type="vertical" className={styles.divider} />
                <Button
                  type={isGrayscale ? "link" : "text"}
                  icon={<ContrastIcon />}
                  onClick={() =>
                    setSimulationType(isGrayscale ? "normal" : "grayscale")
                  }
                  className={styles.simulationButton}
                >
                  {formatMessage({ id: "Grayscale Mode" })}
                </Button>
              </>
            )}

            <div className={styles.btnGroup}>
              <Button
                icon={<RollbackOutlined />}
                onClick={undo}
                disabled={!canUndo}
              />
              <Button
                className={styles.redo}
                icon={<RollbackOutlined />}
                onClick={redo}
                disabled={!canRedo}
              />
              <Space>
                <Button key="save" icon={<SaveIcon />} onClick={save}>
                  {formatMessage({ id: "Save" })}
                </Button>
                <Button
                  key="export"
                  icon={<DownloadOutlined />}
                  type="primary"
                  onClick={() => setIsExporting(true)}
                >
                  {formatMessage({ id: "Export" })}
                </Button>
              </Space>
              <ExportPaletteModal
                palette={currentPalette}
                visible={isExporting}
                onCancel={handleExportCancel}
              ></ExportPaletteModal>
            </div>
          </div>
          <Content className={styles.content}>
            <Outlet
              context={{
                type: currentProtestType,
              }}
            />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Layouts;
