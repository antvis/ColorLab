import type React from "react";
import { Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import styles from "./index.module.less";

interface OptimizationProps {
  style?: React.CSSProperties;
  optimize?: () => void;
}

const Optimization: React.FC<OptimizationProps> = ({ style = {}, optimize = () => {} }) => {
  const { formatMessage } = useIntl();
  return (
    <Button
      type="primary"
      ghost
      icon={<InfoCircleOutlined />}
      className={styles.optimization}
      style={style}
      onClick={optimize}
    >
      {formatMessage({ id: "Optimization" })}
    </Button>
  );
};

export default Optimization;
