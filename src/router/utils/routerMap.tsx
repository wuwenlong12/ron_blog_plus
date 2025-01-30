import React from "react";
import { withPageTransition } from "../../components/withPageTransition";
import Init from "../../pages/Init/Init";

export const componentKey = {
  Layout: "Layout",
  Home: "Home",
  Diary: "Diary",
  Article: "Article",
  About: "About",
  ArticleMainContent: "ArticleMainContent",
  Login: "Login",
  Init: "Init",
  Admin: "Admin",
  NotFound: "NotFound",
  Greet: "Greet",
  AboutManager: "AboutManager",
  CarouselManager: "CarouselManager",
  Dashboard: "Dashboard",
  ProductManager: "ProductManager",
  ProfileForm: "ProfileForm",
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
  Login: React.lazy(() =>
    import("../../pages/Login/Login").then((mod) => ({
      default: withPageTransition(mod.default),
    }))
  ),
  Init: React.lazy(() =>
    import("../../pages/Init/Init").then((mod) => ({
      default: withPageTransition(mod.default),
    }))
  ),
  Greet: React.lazy(() =>
    import("../../pages/Greet/Greet").then((mod) => ({
      default: withPageTransition(mod.default),
    }))
  ),
  Admin: React.lazy(() =>
    import("../../Admin/Admin").then((mod) => ({
      default: withPageTransition(mod.default),
    }))
  ),
  AboutManager: React.lazy(() =>
    import("../../Admin/pages/AboutManager").then((mod) => ({
      default: withPageTransition(mod.default),
    }))
  ),
  CarouselManager: React.lazy(() =>
    import("../../Admin/pages/CarouselManager").then((mod) => ({
      default: withPageTransition(mod.default),
    }))
  ),
  Dashboard: React.lazy(() =>
    import("../../Admin/pages/Dashboard").then((mod) => ({
      default: withPageTransition(mod.default),
    }))
  ),
  ProductManager: React.lazy(() =>
    import("../../Admin/pages/ProductManager").then((mod) => ({
      default: withPageTransition(mod.default),
    }))
  ),
  ProfileForm: React.lazy(() =>
    import("../../Admin/pages/ProfileForm").then((mod) => ({
      default: withPageTransition(mod.default),
    }))
  ),
  NotFound: React.lazy(() =>
    import("../../pages/NotFound/NotFound").then((mod) => ({
      default: withPageTransition(mod.default),
    }))
  ),
};
