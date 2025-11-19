import { Layout, Button } from "antd";
import { ClosePaletteConfigIcon } from "@/components/icons";
import PaletteConfigPanel from "./PaletteConfigPanel";
import { usePaletteConfigCollapsedContext } from "@/contexts/paletteConfigCollapsed";
import type { ColorSchemeInfo } from "@/constants/colorSchemeInfos";
import styles from "./index.module.less";

const { Sider } = Layout;

const PaletteConfigSider = ({
  colorSchemeInfo,
}: {
  colorSchemeInfo: ColorSchemeInfo;
}) => {
  const { paletteConfigCollapsed, setPaletteConfigCollapsed } =
    usePaletteConfigCollapsedContext();

  if (paletteConfigCollapsed) {
    return <></>;
  }

  return (
    <Sider
      theme="light"
      width={320} /* 240 */
      collapsedWidth={0}
      className={styles.sider}
      collapsible
      trigger={null}
      collapsed={paletteConfigCollapsed}
    >
      <PaletteConfigPanel colorSchemeInfo={colorSchemeInfo} />

      <Button
        icon={<ClosePaletteConfigIcon />}
        className={styles.siderCloseButton}
        onClick={() => setPaletteConfigCollapsed(true)}
      />
    </Sider>
  );
};

export default PaletteConfigSider;
