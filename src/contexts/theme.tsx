import { createContext, useContext, useEffect } from "react";
import { noop } from "lodash";
import { useLocalStorageState } from "ahooks";

type SetState<S> = S | ((prevState?: S) => S);

enum Theme {
  /** 明亮主题 */
  Light = "light",
  /** 暗色主题 */
  Dark = "dark",
}

const DEFAULT_THEME = Theme.Light as `${Theme}`;

const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  setTheme: noop as (value: SetState<"light" | "dark">) => void,
});

const ThemeProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useLocalStorageState("app-theme", {
    defaultValue: DEFAULT_THEME,
  });

  useEffect(() => {
    if (theme === Theme.Dark) {
      document.body.style.setProperty("--main-bg-color", "#151515");
      document.body.style.setProperty("--second-bg-color", "#222222");
      document.body.style.setProperty("--third-bg-color", "#363636");
      document.body.style.setProperty("--dashboard-bg-color", "#2d2e2f");
      document.body.style.setProperty("--hover-bg-color", "#343434");
      document.body.style.setProperty("--main-border-color", "#383838");
      document.body.style.setProperty("--second-border-color", "#A9A9A9");
      document.body.style.setProperty(
        "--main-text-color",
        "rgba(255, 255, 255, 0.85)"
      );
      document.body.style.setProperty(
        "--second-text-color",
        "rgba(255, 255, 255, 0.65)"
      );
      document.body.style.setProperty(
        "--third-text-color",
        "rgba(255, 255, 255, 0.45)"
      );
      document.body.style.setProperty(
        "--forth-text-color",
        "rgba(255, 255, 255, 0.25)"
      );
      document.body.style.setProperty("--main-shadow-color", "#5a5858");
    } else {
      document.body.style.setProperty("--main-bg-color", "#FFFFFF");
      document.body.style.setProperty("--second-bg-color", "#F8F8F8");
      document.body.style.setProperty("--third-bg-color", "#f5f5f5");
      document.body.style.setProperty("--dashboard-bg-color", "#eaf2f6");
      document.body.style.setProperty("--hover-bg-color", "#f0f7ff");
      document.body.style.setProperty("--main-border-color", "#F0F0F0");
      document.body.style.setProperty("--second-border-color", "#D9D9D9");
      document.body.style.setProperty(
        "--main-text-color",
        "rgba(0, 0, 0, 0.85)"
      );
      document.body.style.setProperty(
        "--second-text-color",
        "rgba(0, 0, 0, 0.65)"
      );
      document.body.style.setProperty(
        "--third-text-color",
        "rgba(0, 0, 0, 0.45)"
      );
      document.body.style.setProperty(
        "--forth-text-color",
        "rgba(0, 0, 0, 0.25)"
      );
      document.body.style.setProperty("--main-shadow-color", "#cac8c8");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const withThemeProvider =
  <T extends Record<string, any>>(Component: React.ComponentType<T>) =>
  (props: T) => {
    return (
      <ThemeProvider>
        <Component {...props} />
      </ThemeProvider>
    );
  };

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
