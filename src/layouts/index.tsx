import React, { useState } from 'react';
import { Layout, Menu, Button, Space, Divider, Dropdown, Radio } from 'antd';
import { Link, useHistory, useModel, useIntl, setLocale } from 'umi';
import {
  DownloadOutlined,
  RollbackOutlined,
  RetweetOutlined,
  BulbOutlined,
  CloseOutlined,
  FolderOpenOutlined,
  TranslationOutlined,
} from '@ant-design/icons';
import { isContinuousPalette, isMatrixPalette } from '@antv/color-schema';
import { paletteGeneration } from '@antv/smart-color';
import styles from './index.less';
import { PaletteIcon, LayoutIcon, ControlIcon, GlassesIcon, ContrastIcon, SaveIcon } from '@/components/icons';
import Assets from '@/components/Assets';
import COLOR_BLINDNESS_SIMULATION_INFOS from '@/consts/colorBlindnessSimulationInfos';
import PaletteConfigSider from '@/components/PaletteConfigSider';
import ExportPaletteModal from '@/components/Modal/ExportPaletteModal';
import { PROTEST_INFOS } from '@/consts/protestInfo';

const { Content, Sider } = Layout;
const LANGUAGES = ['en-US', 'zh-CN'] as const;
type Languages = typeof LANGUAGES[number];
const LANGUAGE_NAME: Record<Languages, string> = {
  'en-US': 'English',
  'zh-CN': '简体中文',
};

export default ({ children }: { children: any }) => {
  const {
    location: { pathname },
  } = useHistory();
  const { formatMessage } = useIntl();
  const { simulationType, setSimulationType } = useModel('simulationType');
  const { theme, setTheme } = useModel('theme');
  const { currentPalette, locked, setCurrentPalette, canUndo, canRedo, redo, undo } = useModel('currentPalette');
  const { paletteConfig } = useModel('paletteConfig');
  const { myAssets, savePalette } = useModel('myAssets');
  const isGrayscale = simulationType === 'grayscale';
  const isBlindSimulation = simulationType !== 'normal' && !isGrayscale;
  const isProtest = pathname === '/protest';

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [currentProtestType, setCurrentProtestType] = useState(PROTEST_INFOS[0].type);
  const { colorSchemeInfo } = useModel('colorSchemeInfo');
  const { setPaletteConfigCollapsed } = useModel('paletteConfigCollapsed');

  const handleExportCancel = () => {
    setIsExporting(false);
  };

  const save = () => {
    if (currentPalette !== myAssets.palettes[myAssets.palettes.length - 1]) {
      savePalette(currentPalette);
    }
  };

  const regeneratePalette = () => {
    if (!isContinuousPalette(currentPalette) && !isMatrixPalette(currentPalette)) {
      const palette = paletteGeneration(colorSchemeInfo.type, {
        colors: currentPalette.colors.map((color, i) => (locked[i] ? color : undefined)),
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
        <Radio.Button key={info.type} value={info.type} className={styles.protestMenuItem}>
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
        <Menu.Item key={simulation.type} onClick={() => setSimulationType(simulation.type)} className={styles.menuItem}>
          <p className={styles.itemName}>{formatMessage({ id: simulation.name })}</p>
          <small className={styles.itemDescription}>{formatMessage({ id: simulation.description })}</small>
        </Menu.Item>
      ))}
    </Menu>
  );

  const languageMenu = (
    <Menu className={styles.dropdownMenu}>
      {LANGUAGES.map((lang: Languages) => (
        <Menu.Item key={lang} onClick={() => setLocale(lang, false)} className={styles.menuItem}>
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
            <img src="https://gw.alipayobjects.com/zos/antfincdn/AbQVG%266cTw/logo.svg" alt="" />
          </Link>
        </div>

        <div className={styles.menu}>
          <Menu mode="horizontal" defaultSelectedKeys={[pathname]}>
            <Menu.Item key="/pure" icon={<PaletteIcon />}>
              <Link to="/pure">{formatMessage({ id: 'Pure Mode' })}</Link>
            </Menu.Item>
            <Menu.Item key="/" icon={<LayoutIcon />}>
              <Link to="/">{formatMessage({ id: 'Preview Mode' })}</Link>
            </Menu.Item>
            <Menu.Item key="/protest" icon={<ControlIcon />}>
              <Link to="/protest">{formatMessage({ id: 'Professional Test' })}</Link>
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
            {formatMessage({ id: 'Instruction' })}
          </Button>
          <Button
            type="link"
            href="https://www.yuque.com/colorlab/ehwolf"
            target="_blank"
            className={styles.toolbarItem}
          >
            {formatMessage({ id: 'Color Knowledge' })}
          </Button>
          <Dropdown overlay={languageMenu}>
            <Button className={styles.toolbarButton} icon={<TranslationOutlined />} />
          </Dropdown>
          <Button
            className={styles.toolbarButton}
            icon={<BulbOutlined />}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />
        </div>
      </div>
      <Layout>
        <Sider theme="light" width={320} className={styles.sider} collapsible trigger={null} collapsed={collapsed}>
          <Assets collapsed={collapsed} />
          {!collapsed ? (
            <Button icon={<CloseOutlined />} className={styles.siderCloseButton} onClick={() => setCollapsed(true)} />
          ) : (
            <Button
              icon={<FolderOpenOutlined />}
              className={styles.siderOpenButton}
              onClick={() => handleSiderOpenButton()}
            />
          )}
        </Sider>

        <PaletteConfigSider colorSchemeInfo={colorSchemeInfo} />

        <Layout>
          <div className={styles.subHeader}>
            {isProtest ? (
              protestMenu
            ) : (
              <>
                <Button type="link" icon={<RetweetOutlined />} onClick={regeneratePalette}>
                  {formatMessage({ id: 'Change' })}
                </Button>
                <Dropdown overlay={blindSimulationMenu}>
                  <Button
                    type={isBlindSimulation ? 'link' : 'text'}
                    icon={<GlassesIcon />}
                    className={styles.dropdownButton}
                  >
                    {isBlindSimulation
                      ? formatMessage({
                          id: COLOR_BLINDNESS_SIMULATION_INFOS.find((simulation) => simulation.type === simulationType)
                            ?.name,
                        })
                      : formatMessage({
                          id: 'Color Blindness Simulation',
                        })}
                  </Button>
                </Dropdown>
                <Divider type="vertical" className={styles.divider} />
                <Button
                  type={isGrayscale ? 'link' : 'text'}
                  icon={<ContrastIcon />}
                  onClick={() => setSimulationType(isGrayscale ? 'normal' : 'grayscale')}
                  className={styles.simulationButton}
                >
                  {formatMessage({ id: 'Grayscale Mode' })}
                </Button>
              </>
            )}

            <div className={styles.btnGroup}>
              <Button icon={<RollbackOutlined />} onClick={undo} disabled={!canUndo} />
              <Button className={styles.redo} icon={<RollbackOutlined />} onClick={redo} disabled={!canRedo} />
              <Space>
                <Button key="save" icon={<SaveIcon />} onClick={save}>
                  {formatMessage({ id: 'Save' })}
                </Button>
                <Button key="export" icon={<DownloadOutlined />} type="primary" onClick={() => setIsExporting(true)}>
                  {formatMessage({ id: 'Export' })}
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
            {isProtest
              ? React.Children.map(children, (child) => React.cloneElement(child, { type: currentProtestType }))
              : children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
