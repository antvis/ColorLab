import React from 'react';
import { useIntl, useModel } from 'umi';
import { Typography, InputNumber, Radio } from 'antd';
import { isNumberConfig, isColorConfig, isRadioConfig } from '@/consts/colorSchemeInfos';
import { ContinuousPaletteHighlightIcon } from '@/components/icons';
import ColorSelectBox from './ColorSelectBox';
import type { ColorSchemeInfo } from '@/consts/colorSchemeInfos';
import styles from './index.less';

const { Paragraph } = Typography;

const PaletteConfigPanel = ({ colorSchemeInfo }: { colorSchemeInfo: ColorSchemeInfo }) => {
  const { formatMessage } = useIntl();
  const { paletteConfig, updatePaletteConfigItem } = useModel('paletteConfig');
  const { name, description, config } = colorSchemeInfo;

  return (
    <div className={styles.paletteConfig}>
      <div className={styles.paletteConfigTitle}>
        <span> {formatMessage({ id: name })} </span>
      </div>

      <div className={styles.paletteConfigContent}>
        <Paragraph>
          <pre className={styles.paletteTypeInfoPanel}>{description}</pre>
        </Paragraph>

        {config.map((item) => {
          if (isNumberConfig(item)) {
            return (
              <div className={styles.colorInfo} key={item.id}>
                <label className={styles.colorInfoLabel}> {formatMessage({ id: item.name })} </label>
                <InputNumber
                  style={{
                    width: '100%',
                  }}
                  autoFocus={false}
                  size="large"
                  value={paletteConfig[item.id]}
                  min={item.minVal}
                  max={item.maxVal}
                  step="1"
                  onChange={(value) => updatePaletteConfigItem(item.id, value)}
                />
              </div>
            );
          }
          if (isColorConfig(item)) {
            return (
              <div className={styles.colorInfo} key={item.id}>
                <label className={styles.colorInfoLabel}> {formatMessage({ id: item.name })} </label>
                <ColorSelectBox
                  color={paletteConfig[item.id]}
                  onChange={(value) => updatePaletteConfigItem(item.id, value)}
                />
              </div>
            );
          }
          if (isRadioConfig(item)) {
            return (
              <div className={styles.colorInfo} key={item.id}>
                <label className={styles.colorInfoLabel}> {formatMessage({ id: item.name })} </label>
                <Radio.Group
                  value={paletteConfig[item.id]}
                  className={styles.colorTendency}
                  size="large"
                  onChange={(event) => updatePaletteConfigItem(item.id, event.target.value)}
                >
                  {item.options.map((option) => (
                    <Radio.Button key={option} className={styles.continuousPaletteIcon} value={option}>
                      <ContinuousPaletteHighlightIcon />
                      <span> {formatMessage({ id: option })} </span>
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default PaletteConfigPanel;
