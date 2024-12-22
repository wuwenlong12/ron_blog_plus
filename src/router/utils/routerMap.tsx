import React from "react";
import { withPageTransition } from "../../components/withPageTransition";

export const componentKey = {
  Layout: "Layout",
  Home: "Home",
  Diary: "Diary",
  Article: "Article",
  About: "About",
  ArticleMainContent: "ArticleMainContent",
};

export const componentMap: Record<
  string,
  React.LazyExoticComponent<React.FC<any>>
> = {
  Layout: React.lazy(() =>
    import("../../layout/index").then((mod) => ({
      default: withPageTransition(mod.default),
    }))
  ),
  Home: React.lazy(() =>
    import("../../pages/Home/Home").then((mod) => ({
      default: withPageTransition(mod.default),
    }))
  ),
  Diary: React.lazy(() =>
    import("../../pages/Diary/Diary").then((mod) => ({
      default: withPageTransition(mod.default),
    }))
  ),
  Article: React.lazy(() =>
    import("../../pages/Article/Article").then((mod) => ({
      default: withPageTransition(mod.default),
    }))
  ),
  About: React.lazy(() =>
    import("../../pages/About/About").then((mod) => ({
      default: withPageTransition(mod.default),
    }))
  ),
  ArticleMainContent: React.lazy(() =>
    import("../../pages/ArticleMainContent/ArticleMainContent").then((mod) => ({
      default: withPageTransition(mod.default),
    }))
  ),
};
