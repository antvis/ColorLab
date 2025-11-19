import type { FC, ReactNode, CSSProperties } from "react";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { Tabs, Input, Upload, Modal, message } from "antd";
import { PictureFilled } from "@ant-design/icons";
import { getPaletteFromString } from "@antv/smart-color";
import classNames from "classnames";
import Ajv from "ajv";
import { JSONIcon } from "@/components/icons";
import PaletteByImage from "@/components/PaletteByImage";
import Swatch from "../Swatch";
import type { ColorSchema, Palette } from "@antv/color-schema";
import styles from "./index.module.less";

const { TabPane } = Tabs;
const { Dragger } = Upload;
const { TextArea } = Input;
const ajv = new Ajv();
const COLOR_SCHEMA_URL =
  "https://unpkg.com/@antv/color-schema@0.2.2/build/color-schema.json";

const getColorSchema = async () => {
  try {
    const response = await fetch(COLOR_SCHEMA_URL);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const ImportPaletteModalWrapper = (props: {
  visible: boolean;
  onOk: any;
  onCancel: any;
  children: ReactNode;
  style?: CSSProperties;
}) => {
  const { formatMessage } = useIntl();
  return (
    <Modal
      title={formatMessage({ id: "Import Palette" })}
      visible={props.visible}
      okText={formatMessage({ id: "OK" })}
      onOk={props.onOk}
      cancelText={formatMessage({ id: "Cancel" })}
      onCancel={props.onCancel}
      className={styles.modal}
      bodyStyle={{
        paddingTop: 0,
        paddingBottom: "15px",
        ...props.style,
      }}
      centered
    >
      {props.children}
    </Modal>
  );
};

type ImportType = "string" | "json";
let validate: Function;
const ImportPaletteModalByCode = ({
  visible = false,
  onOk = () => {},
  onCancel = () => {},
}: {
  visible?: boolean;
  onOk?: (palette: Palette | Palette[]) => void;
  onCancel?: () => void;
}) => {
  const { formatMessage } = useIntl();
  const [colorString, setColorString] = useState<string>();
  const [jsonObject, setJsonObject] = useState<ColorSchema>();
  const [uploading, setUploading] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<ImportType>("string");

  const initValidate = async () => {
    if (!validate) {
      const result = await getColorSchema();
      validate = ajv.compile(result as Record<string, unknown>);
    }
  };

  useEffect(() => {
    initValidate();
  }, []);

  const uploadJson = (e: any) => {
    const reader = new FileReader();
    const { file } = e;
    reader.onloadend = async () => {
      const json = JSON.parse(reader.result as string);
      initValidate();

      if (validate(json)) {
        setJsonObject(json as ColorSchema);
      } else {
        message.error(
          formatMessage({ id: "Uploaded files cannot be parsed." })
        );
      }
      setUploading(false);
    };
    reader.readAsText(file);
  };

  const inputColorString = (event: any) => {
    setColorString(event.target.value);
  };

  return (
    <ImportPaletteModalWrapper
      visible={visible}
      onOk={() => {
        if (activeKey === "string") {
          if (colorString) {
            onOk(getPaletteFromString(colorString));
          }
        } else if (activeKey === "json") {
          if (jsonObject) {
            onOk(jsonObject.palettes);
          }
        }
        setColorString(undefined);
        setJsonObject(undefined);
      }}
      onCancel={() => {
        onCancel();
        setColorString(undefined);
        setJsonObject(undefined);
      }}
    >
      <Tabs
        defaultActiveKey="string"
        onChange={(key) => setActiveKey(key as ImportType)}
      >
        <TabPane tab={formatMessage({ id: "By String" })} key="string">
          <div className={styles.sourceContainer}>
            <TextArea
              className={styles.sourceContainerInput}
              placeholder="#FB9747,#DE5844,#52BFC1,#22A34C,#F1BF2A,#94674E,#FF9CB8,#A562C0"
              autoSize={{ minRows: 6, maxRows: 8 }}
              onChange={inputColorString}
              value={colorString}
            />
            {colorString && (
              <Swatch
                palette={getPaletteFromString(colorString)}
                toolbar={false}
              />
            )}
          </div>
        </TabPane>
        <TabPane tab={formatMessage({ id: "By File" })} key="json">
          {jsonObject ? (
            jsonObject.palettes.map((palette) => (
              <Swatch
                palette={palette}
                key={palette.id || palette.name}
                toolbar={false}
              />
            ))
          ) : (
            <>
              <Dragger
                showUploadList={false}
                customRequest={uploadJson}
                beforeUpload={() => setUploading(true)}
                disabled={uploading}
                className={classNames(
                  styles.sourceContainer,
                  styles.localContainer
                )}
                accept={".colorlab"}
              >
                <p className={styles.localLogo}>
                  <JSONIcon />
                </p>
                <p className={styles.localText}>
                  {formatMessage({ id: "Browse or drag .colorlab files" })}
                </p>
              </Dragger>
              <div style={{ marginTop: "3px" }}>
                <a
                  href="https://github.com/antvis/color-schema#readme"
                  target="_blank"
                  style={{ float: "right", fontSize: "12px" }}
                  rel="noreferrer"
                >
                  {formatMessage({ id: "Learn about Color Schema(.colorlab)" })}
                </a>
              </div>
            </>
          )}
        </TabPane>
      </Tabs>
    </ImportPaletteModalWrapper>
  );
};

const ImportPaletteModalByImage = ({
  visible = false,
  onOk = () => {},
  onCancel = () => {},
}: {
  visible?: boolean;
  onOk?: (palette: Palette) => void;
  onCancel?: () => void;
}) => {
  const { formatMessage } = useIntl();
  const [image, setImage] = useState<string>();
  const [save, setSave] = useState<any>();

  const uploadImage = (e: any) => {
    const reader = new FileReader();
    const { file } = e;
    reader.onloadend = () => {
      const url = reader.result;
      setImage(url as string);
    };
    reader.readAsDataURL(file);
  };

  const inputImage = (event: any) => {
    setImage(event.target.value);
  };

  const saveFuc = (palette: Palette) => {
    onOk(palette);
    setImage(undefined);
  };

  return (
    <ImportPaletteModalWrapper
      visible={visible}
      onOk={() => {
        setSave(() => saveFuc);
      }}
      onCancel={() => {
        onCancel();
        setImage(undefined);
      }}
    >
      <Tabs
        defaultActiveKey="local"
        onChange={() => {
          setImage(undefined);
        }}
      >
        <TabPane tab={formatMessage({ id: "Native Upload" })} key="local">
          {image ? (
            <PaletteByImage image={image} save={save}></PaletteByImage>
          ) : (
            <Dragger
              showUploadList={false}
              customRequest={uploadImage}
              className={classNames(
                styles.sourceContainer,
                styles.localContainer
              )}
              accept={".jpg, .jpeg, .png, .svg"}
            >
              <p className={styles.localLogo}>
                <PictureFilled />
              </p>
              <p className={styles.localText}>
                {formatMessage({ id: "Browse or drag images" })}
              </p>
            </Dragger>
          )}
        </TabPane>
        <TabPane tab={formatMessage({ id: "By URL" })} key="url">
          {image ? (
            <PaletteByImage image={image} save={save} />
          ) : (
            <div className={styles.sourceContainer}>
              <p className={styles.sourceContainerText}>
                {formatMessage({ id: "Image URL" })}:
              </p>
              <Input
                placeholder="http://"
                className={classNames(
                  styles.sourceContainerInput,
                  styles.urlInput
                )}
                onPressEnter={inputImage}
              />
            </div>
          )}
        </TabPane>
      </Tabs>
    </ImportPaletteModalWrapper>
  );
};

type ImportPaletteType = "code" | "image";
interface ImportPaletteModalProps {
  type: ImportPaletteType;
  visible?: boolean;
  onOk?: (palette: Palette | Palette[]) => void;
  onCancel?: () => void;
}

const ImportPaletteModal: FC<ImportPaletteModalProps> = (props) => {
  const { type } = props;

  switch (type) {
    case "code":
      return <ImportPaletteModalByCode {...props} />;
    case "image":
      return <ImportPaletteModalByImage {...props} />;
    default:
      return <></>;
  }
};

export default ImportPaletteModal;
