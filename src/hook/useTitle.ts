import { useEffect } from "react";
import { RootState } from "../store";
import { useSelector } from "react-redux";

const useTitle = () => {
  const { siteInfo } = useSelector((state: RootState) => state.site);

  useEffect(() => {
    if (siteInfo) {
      document.title = `${siteInfo.site_name || "全民博客"}`;
    } else {
      document.title = `全民博客`;
    }
  }, [siteInfo]);
};

export default useTitle;
