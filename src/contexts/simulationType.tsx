import { createContext, useContext, useState } from "react";
import { noop } from "lodash";
import type { SimulationType } from "@antv/smart-color";

const DEFAULT_TYPE = "normal" as SimulationType;

const SimulationTypeContext = createContext({
  simulationType: DEFAULT_TYPE,
  setSimulationType: noop as React.Dispatch<
    React.SetStateAction<SimulationType>
  >,
});

const SimulationTypeProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [simulationType, setSimulationType] = useState(DEFAULT_TYPE);

  return (
    <SimulationTypeContext.Provider
      value={{
        simulationType,
        setSimulationType,
      }}
    >
      {children}
    </SimulationTypeContext.Provider>
  );
};

export const withSimulationTypeProvider =
  <T extends Record<string, any>>(Component: React.ComponentType<T>) =>
  (props: T) => {
    return (
      <SimulationTypeProvider>
        <Component {...props} />
      </SimulationTypeProvider>
    );
  };

export const useSimulationTypeContext = () => {
  return useContext(SimulationTypeContext);
};
