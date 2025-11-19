import { BrowserRouter } from "react-router-dom";
import Layout from "./layouts";
import { useRoutes } from "react-router-dom";
import { IntlProvider } from "@/locales/IntlProvider";
import { useLocaleContext, withLocaleProvider } from "@/locales/context";
import { withThemeProvider } from "@/contexts/theme";
import { withProviders } from "@/hocs/withProviders";
import { withSimulationTypeProvider } from "@/contexts/simulationType";
import { withColorSchemeInfoProvider } from "@/contexts/colorSchemeInfo";
import { withPaletteConfigCollapsedProvider } from "@/contexts/paletteConfigCollapsed";
import { withPaletteConfigProvider } from "@/contexts/paletteConfig";
import { withMyAssetsProvider } from "@/contexts/myAssets";
import { withCurrentPaletteProvider } from "@/contexts/currentPalette";
import Preview from "@/pages/preview";
import Pure from "@/pages/pure";
import Protest from "@/pages/protest";

// 配置路由
const AppRoutes = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Preview /> },
        { path: "pure", element: <Pure /> },
        { path: "protest", element: <Protest /> },
      ],
    },
  ]);
  return element;
};

const AppContent = () => {
  const { locale } = useLocaleContext();

  return (
    <IntlProvider locale={locale}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </IntlProvider>
  );
};

/**
 * 这里为什么这么多 context hoc？
 *
 * 重构了项目状态管理，将原先基于 umi useModule 的方案逐步迁移至 React Context。
 * 可渐进式合并或弃用部分 Context 来优化逻辑，减少冗余层级，提升代码可维护性和性能。
 */
const App = withProviders(
  withCurrentPaletteProvider,
  withMyAssetsProvider,
  withColorSchemeInfoProvider,
  withPaletteConfigCollapsedProvider,
  withPaletteConfigProvider,
  withSimulationTypeProvider,
  withLocaleProvider,
  withThemeProvider
)(AppContent);

export default App;
