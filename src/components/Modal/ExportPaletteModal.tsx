import { useState } from "react";
import { useIntl } from "react-intl";
import { Modal, Row, Col, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { copyToClipboard } from "@/utils";
import { EXPORT_PALETTE_TYPES, EXPORT_PALETTE_TYPE_INFOS } from "./exportPaletteTypeInfos";
import type { Palette } from "@antv/color-schema";
import type { ExportPaletteType } from "./exportPaletteTypeInfos";
import styles from "./index.module.less";

interface ExportPaletteModalProps {
  palette: Palette;
  visible?: boolean;
  onCancel?: () => void;
}

const ExportPaletteModal: React.FC<ExportPaletteModalProps> = (props) => {
  const { formatMessage } = useIntl();
  const { palette } = props;
  const [type, setType] = useState<ExportPaletteType | "index">("index");
  const isIndex = type === "index";

  const onCancel = () => {
    if (props.onCancel) {
      props.onCancel();
    }
    setType("index");
  };
  let onCopy = () => {};
  let onDownload = () => {};

  const header = (exportType: ExportPaletteType) => (
    <div className={styles.header}>
      <Button
        type="link"
        className={styles.headerButton}
        icon={<LeftOutlined />}
        onClick={() => setType("index")}
      >
        {formatMessage({ id: "ExportPaletteType" }, { type: exportType.toUpperCase() })}
      </Button>
    </div>
  );

  const content = (() => {
    if (EXPORT_PALETTE_TYPES.includes(type)) {
      const exportInfo = EXPORT_PALETTE_TYPE_INFOS[type];
      const { dom, str } = exportInfo.convert(palette);
      onCopy = () => copyToClipboard(str);
      onDownload = () => exportInfo.download(str);
      return dom;
    }

    return (
      <Row>
        {EXPORT_PALETTE_TYPES.map((exportType) => (
          <Col span={8} className={styles.exportTypeContainer} key={exportType}>
            <Button
              className={styles.exportTypeButton}
              icon={EXPORT_PALETTE_TYPE_INFOS[exportType].icon}
              onClick={() => setType(exportType)}
            ></Button>
            <div className={styles.exportTypeText}>{exportType.toUpperCase()}</div>
          </Col>
        ))}
      </Row>
    );
  })();

  const footer = (
    <>
      <Button onClick={onCopy}>{formatMessage({ id: "Copy" })}</Button>
      <Button type="primary" onClick={onDownload}>
        {formatMessage({ id: "Download" })}
      </Button>
    </>
  );

  return (
    <Modal
      title={formatMessage({ id: "ExportPalette" })}
      visible={props.visible}
      onCancel={onCancel}
      className={styles.modal}
      bodyStyle={{
        paddingTop: isIndex ? "30px" : "10px",
        paddingBottom: isIndex ? "30px" : "10px",
      }}
      footer={isIndex ? null : footer}
      centered
      width="400px"
    >
      {!isIndex && header(type)}
      {content}
    </Modal>
  );
};

export default ExportPaletteModal;
