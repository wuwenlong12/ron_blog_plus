import React from "react";

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
  Layout: React.lazy(() => import("../../layout/index")),
  Home: React.lazy(() => import("../../pages/Home/Home")),
  Diary: React.lazy(() => import("../../pages/Diary/Diary")),
  Article: React.lazy(() => import("../../pages/Article/Article")),
  About: React.lazy(() => import("../../pages/About/About")),
  ArticleMainContent: React.lazy(
    () => import("../../pages/ArticleMainContent/ArticleMainContent")
  ),
};
