import React from 'react';
import type { FC } from 'react';
import { useModel } from 'umi';
import classNames from 'classnames';
import { isContinuousPalette, isMatrixPalette } from '@antv/color-schema';
import type { ProtestType } from '@/consts/protestInfo';
import styles from './index.less';
import DistanceMatrix from '@/components/DistanceMatrix';
import ColorModel from '@/components/ColorModel';

interface ProtestProps {
  type: ProtestType;
}

const Protest: FC<ProtestProps> = ({ type }) => {
  const { currentPalette, locked, updateColor, lockColor, removeColor, setCurrentPalette } = useModel('currentPalette');
  const { theme } = useModel('theme');
  let content = <></>;
  if (!isContinuousPalette(currentPalette) && !isMatrixPalette(currentPalette)) {
    switch (type) {
      case 'distanceMatrix':
        content = (
          <DistanceMatrix
            defaultThreshold={30}
            palette={currentPalette}
            locked={locked}
            updateColor={updateColor}
            lockColor={lockColor}
            removeColor={removeColor}
            updatePalette={setCurrentPalette}
          />
        );
        break;
      case 'colorModel':
        content = <ColorModel palette={currentPalette} theme={theme}></ColorModel>;
        break;
      default:
        break;
    }
  }

  return <div className={classNames(styles.container, styles.protest)}>{content}</div>;
};

export default Protest;
