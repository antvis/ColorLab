import { PaletteType } from '@antv/color-schema';

type ChartType = 'Heatmap' | 'Area' | 'Pie' | 'Column' | 'Line';
interface Chart {
  id: string;
  type: ChartType;
  data: string;
  config?: any;
  span?: number; // width: [1, 24]
}
export interface DashBoard {
  name: string;
  type: PaletteType;
  charts: Chart[];
}
