import { useState } from "react";
import { useDidMount } from "./useDidMount";

export function useBrowserLanguage(): "zh-CN" | "en-US" {
  const [lang, setLang] = useState<"zh-CN" | "en-US">("zh-CN");

  useDidMount(() => {
    const browserLang = navigator.language || navigator.languages[0] || "zh";

    if (browserLang.toLowerCase().startsWith("zh")) {
      setLang("zh-CN");
    } else {
      setLang("en-US");
    }
  });

  return lang;
}
