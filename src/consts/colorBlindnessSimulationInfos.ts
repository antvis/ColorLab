import type { ColorBlindnessSimulationType } from '@antv/smart-color';

interface ColorBlindnessSimulationInfo {
  type: ColorBlindnessSimulationType;
  name: string;
  description: string;
}

const COLOR_BLINDNESS_SIMULATION_INFOS: ColorBlindnessSimulationInfo[] = [
  {
    type: 'normal',
    name: 'Normal',
    description: '90-92% of man, 99.5% of woman',
  },
  {
    type: 'achromatopsia',
    name: 'Achromatopsia',
    description: '0.00001% of man, 0.00001% of woman',
  },
  {
    type: 'achromatomaly',
    name: 'Achromatomaly',
    description: 'incomplete achromatopsia',
  },
  {
    type: 'protanopia',
    name: 'Protanopia',
    description: '1.0-1.3% of man, 0.02% of woman',
  },
  {
    type: 'deuteranopia',
    name: 'Deuteranopia',
    description: '1.0-1.2% of man, 0.01% of woman',
  },
  {
    type: 'tritanopia',
    name: 'Tritanopia',
    description: '0.001% of man, 0.03% of woman',
  },
  {
    type: 'protanomaly',
    name: 'Protanomaly',
    description: '1.3% of man, 0.02% of woman',
  },
  {
    type: 'deuteranomaly',
    name: 'Deuteranomaly',
    description: '5.0% of man, 0.35% of woman',
  },
  {
    type: 'tritanomaly',
    name: 'Tritanomaly',
    description: '0.0001% of man, 0.0001% of woman',
  },
];

export default COLOR_BLINDNESS_SIMULATION_INFOS;
