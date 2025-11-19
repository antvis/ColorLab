import { useState } from "react";
import { useIntl } from "react-intl";
import { Space, Collapse, Button, Divider, InputNumber, message } from "antd";
import {
  ImportOutlined,
  PictureFilled,
  FolderOpenOutlined,
  FilterOutlined,
  ReloadOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { isArray, differenceWith, isEqual } from "lodash";
import classNames from "classnames";
import Swatch from "@/components/Swatch";
import ImportPaletteModal from "@/components/Modal/ImportPaletteModal";
import { COLOR_SCHEME_INFOS } from "@/constants/colorSchemeInfos";
import ASSETS from "@/constants/assets";
import { useColorSchemeInfoContext } from "@/contexts/colorSchemeInfo";
import type { ColorSchemeInfo } from "@/constants/colorSchemeInfos";
import { usePaletteConfigCollapsedContext } from "@/contexts/paletteConfigCollapsed";
import type { ColorSchemeType, Palette } from "@antv/color-schema";
import { useMyAssetsContext } from "@/contexts/myAssets";
import styles from "./index.module.less";

const { Panel } = Collapse;

const Assets = (props: { collapsed: boolean }) => {
  const { formatMessage } = useIntl();
  const { collapsed = false } = props;
  const { myAssets, savePalette, deletePalette } = useMyAssetsContext();
  const { colorSchemeInfo, setColorSchemeInfo } = useColorSchemeInfoContext();
  const { setPaletteConfigCollapsed } = usePaletteConfigCollapsedContext();

  const [isImportingByCode, setIsImportingByCode] = useState<boolean>(false);
  const [isImportingByImage, setIsImportingByImage] = useState<boolean>(false);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const defaultColorNumberRange: [number, number] = [4, 12];
  const [colorNumberRange, setColorNumberRange] = useState<[number, number]>(
    defaultColorNumberRange
  );
  const [colorScheme, setColorScheme] = useState<ColorSchemeType>();

  const handleInputCodeOk = (input: Palette | Palette[]) => {
    let palettes: Palette[];
    if (isArray(input)) {
      palettes = input;
    } else {
      palettes = [input];
    }
    // my asset already has the input palette?
    const newPalettes = differenceWith(palettes, myAssets.palettes, isEqual);
    if (newPalettes.length > 0) {
      savePalette(newPalettes);
    }
    if (palettes.length > newPalettes.length) {
      message.warning(
        formatMessage({ id: "Duplicate palettes will not be re-imported." })
      );
    }
    setIsImportingByCode(false);
  };

  const handleInputCodeCancel = () => {
    setIsImportingByCode(false);
  };

  const handleInputImageOk = (palette: Palette | Palette[]) => {
    savePalette(palette);
    setIsImportingByImage(false);
  };

  const handleInputImageCancel = () => {
    setIsImportingByImage(false);
  };

  const filterPanel = (
    <div className={styles.filterPanel}>
      <div className={styles.filterPanelSubHeader}>
        {formatMessage({ id: "Color Scheme" })}
      </div>
      <div className={styles.paletteTypes}>
        {COLOR_SCHEME_INFOS.map((info) => (
          <div
            className={styles.paletteType}
            key={info.type}
            onClick={() => {
              if (info.type === colorScheme) setColorScheme(undefined);
              else setColorScheme(info.type);
            }}
          >
            {colorScheme && colorScheme !== info.type
              ? info.icon
              : info.highlightIcon}
            <small className={styles.paletteTypeText}>
              {formatMessage({ id: info.name })}
            </small>
          </div>
        ))}
      </div>
      <div className={styles.filterPanelSubHeader}>
        {formatMessage({ id: "Color Number" })}
      </div>
      <div className={styles.colorNumberRange}>
        <InputNumber
          name="Min. number of colors"
          className={styles.colorNumberInput}
          autoFocus={false}
          size="large"
          value={colorNumberRange[0]}
          min={0}
          max={colorNumberRange[1]}
          step="1"
          onChange={(value) => {
            setColorNumberRange([value, colorNumberRange[1]]);
          }}
        />
        <span className={styles.colorNumberDivider}></span>
        <InputNumber
          name="Max. number of colors"
          className={styles.colorNumberInput}
          autoFocus={false}
          size="large"
          value={colorNumberRange[1]}
          min={colorNumberRange[0]}
          max={30}
          step="1"
          onChange={(value) => {
            setColorNumberRange([colorNumberRange[0], value]);
          }}
        />
      </div>
      <div className={styles.filterPanelFooter}>
        <Button
          className={styles.resetButton}
          icon={<ReloadOutlined />}
          size="small"
          onClick={() => {
            setColorNumberRange(defaultColorNumberRange);
            setColorScheme(undefined);
          }}
        >
          {formatMessage({ id: "Reset" })}
        </Button>
        <Button
          className={styles.collapseButton}
          icon={<UpOutlined />}
          size="small"
          type="link"
          onClick={() => {
            setIsFiltering(false);
          }}
        >
          {formatMessage({ id: "Collapse" })}
        </Button>
      </div>
      <Divider style={{ margin: "10px 0" }} />
    </div>
  );

  const changePaletteTypeConfig = (curPaletteTypeInfo: ColorSchemeInfo) => {
    setColorSchemeInfo(curPaletteTypeInfo);
    setPaletteConfigCollapsed(false);
  };

  if (collapsed) {
    return (
      <div className={styles.assets}>
        <div
          className={classNames(
            styles.paletteTypes,
            styles.paletteTypesVertical
          )}
        >
          {COLOR_SCHEME_INFOS.map((info) => (
            <div
              className={styles.paletteType}
              key={info.type}
              onClick={() => changePaletteTypeConfig(info)}
            >
              {colorSchemeInfo.type === info.type
                ? info.highlightIcon
                : info.icon}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.assets}>
      <div className={styles.assetsTitle}>
        <FolderOpenOutlined className={styles.assetsTitleIcon} />
        <span>{formatMessage({ id: "Palette Assets" })}</span>
      </div>

      <Collapse
        defaultActiveKey={["mine", "explore"]}
        className={styles.assetsContent}
      >
        <Panel
          header={formatMessage({ id: "My Palettes" })}
          key="mine"
          showArrow={false}
          className={styles.minePanel}
        >
          <div className={styles.importBar}>
            <Space>
              <Button
                size="large"
                className={classNames(
                  styles.importButton,
                  styles.importCodeButton
                )}
                block
                icon={<ImportOutlined />}
                onClick={() => {
                  setIsImportingByCode(true);
                }}
              >
                {formatMessage({ id: "Import Palette" })}
              </Button>
              <ImportPaletteModal
                type="code"
                visible={isImportingByCode}
                onOk={handleInputCodeOk}
                onCancel={handleInputCodeCancel}
              ></ImportPaletteModal>
              <Button
                size="large"
                className={styles.importButton}
                block
                icon={<PictureFilled />}
                onClick={() => setIsImportingByImage(true)}
              />
              <ImportPaletteModal
                type="image"
                visible={isImportingByImage}
                onOk={handleInputImageOk}
                onCancel={handleInputImageCancel}
              ></ImportPaletteModal>
            </Space>
          </div>
          {myAssets.palettes.map((palette, index) => (
            <Swatch
              palette={palette}
              key={palette.id || palette.name}
              handleDelete={() => deletePalette(index)}
            />
          ))}
        </Panel>
        <Panel
          header={formatMessage({ id: "Explore" })}
          key="explore"
          showArrow={false}
          extra={
            <FilterOutlined
              className={classNames(styles.filterButton, {
                [styles.filterButtonChoosed]: isFiltering,
              })}
              onClick={(e) => {
                e.stopPropagation();
                setIsFiltering(!isFiltering);
              }}
            />
          }
          className={styles.explorePanel}
        >
          {isFiltering && filterPanel}
          <Collapse
            bordered={false}
            defaultActiveKey={COLOR_SCHEME_INFOS.map((info) => info.type)}
          >
            {COLOR_SCHEME_INFOS.map((info) => {
              if (colorScheme && info.type !== colorScheme) return null;
              const palettes = ASSETS.palettes.filter(
                (palette) =>
                  (palette.colorScheme ? palette.colorScheme : "customized") ===
                    info.type &&
                  palette.colors.length >= colorNumberRange[0] &&
                  palette.colors.length <= colorNumberRange[1]
              );
              if (palettes.length) {
                return (
                  <Panel
                    header={formatMessage({ id: info.name })}
                    key={info.type}
                  >
                    {palettes.map((palette) => (
                      <Swatch
                        palette={palette}
                        key={palette.id || palette.name}
                      />
                    ))}
                  </Panel>
                );
              }
              return null;
            })}
          </Collapse>
        </Panel>
      </Collapse>
    </div>
  );
};

export default Assets;
