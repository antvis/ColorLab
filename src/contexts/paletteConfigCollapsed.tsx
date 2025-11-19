import { createContext, useContext, useState } from "react";
import { noop } from "lodash";

const DEFAULT_PALETTE_CONFIG_COLLAPSED = true;

const PaletteConfigCollapsedContext = createContext({
  paletteConfigCollapsed: DEFAULT_PALETTE_CONFIG_COLLAPSED,
  setPaletteConfigCollapsed: noop as React.Dispatch<
    React.SetStateAction<boolean>
  >,
});

const PaletteConfigCollapsedProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [paletteConfigCollapsed, setPaletteConfigCollapsed] = useState(
    DEFAULT_PALETTE_CONFIG_COLLAPSED
  );

  return (
    <PaletteConfigCollapsedContext.Provider
      value={{
        paletteConfigCollapsed,
        setPaletteConfigCollapsed,
      }}
    >
      {children}
    </PaletteConfigCollapsedContext.Provider>
  );
};

export const withPaletteConfigCollapsedProvider =
  <T extends Record<string, any>>(Component: React.ComponentType<T>) =>
  (props: T) => {
    return (
      <PaletteConfigCollapsedProvider>
        <Component {...props} />
      </PaletteConfigCollapsedProvider>
    );
  };

export const usePaletteConfigCollapsedContext = () => {
  return useContext(PaletteConfigCollapsedContext);
};
