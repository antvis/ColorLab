import React, { createContext, useContext, useState } from "react";
import { noop } from "lodash";
import { useBrowserLanguage } from "@/hooks/useBrowserLanguage";

type Locale = "zh-CN" | "en-US";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "zh-CN" as Locale,
  setLocale: noop,
});

const LocaleProvider = (props: {
  children: React.ReactNode;
  defaultLocale: Locale;
}) => {
  const { children, defaultLocale } = props;

  const [locale, setLocale] = useState<Locale>(defaultLocale);

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export const withLocaleProvider =
  <T extends Record<string, any>>(Component: React.ComponentType<T>) =>
  (props: T) => {
    const lang = useBrowserLanguage();

    return (
      <LocaleProvider defaultLocale={lang}>
        <Component {...props} />
      </LocaleProvider>
    );
  };

export const useLocaleContext = () => {
  const context = useContext(LocaleContext);

  return context;
};
