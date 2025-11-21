import { AppstoreOutlined } from "@ant-design/icons";

export type ProtestType = "distanceMatrix" | "colorModel";

interface ProtestInfo {
  name: string;
  type: ProtestType;
  icon: React.ReactNode;
}

export const PROTEST_INFOS: ProtestInfo[] = [
  {
    name: "Distance Matrix",
    type: "distanceMatrix",
    icon: <AppstoreOutlined />,
  },
  {
    name: "Color Model",
    type: "colorModel",
    icon: <AppstoreOutlined />,
  },
];
