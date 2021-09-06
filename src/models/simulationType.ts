import { useState } from 'react';
import type { SimulationType } from '@antv/smart-color';

export default () => {
  const [simulationType, setSimulationType] = useState<SimulationType>('normal');
  return {
    simulationType,
    setSimulationType,
  };
};
