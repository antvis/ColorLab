import React from 'react';
import { useModel } from 'umi';
import { Layout, Button } from 'antd';
import PaletteConfigPanel from './PaletteConfigPanel';
import type { ColorSchemeInfo } from '@/consts/colorSchemeInfos';

import styles from './index.less';
import { ClosePaletteConfigIcon } from '@/components/icons';

const { Sider } = Layout;

const PaletteConfigSider = ({ colorSchemeInfo }: { colorSchemeInfo: ColorSchemeInfo }) => {
  const { paletteConfigCollapsed, setPaletteConfigCollapsed } = useModel('paletteConfigCollapsed');

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
