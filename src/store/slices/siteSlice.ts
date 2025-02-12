import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getSiteInfo, updateSite } from "../../api/site";
import { UpdateSiteParams } from "../../api/site/type";
import { PartialBlock } from "@blocknote/core";
import { AppDispatch } from "..";

interface SiteState {
  siteInfo: {
    site_sub_url: string;
    site_name: string;
    is_core: boolean;
    is_pass: boolean;
    is_off: boolean;
    name: string;
    avatar: string;
    signatures: string[];
    homepage_signature: string[];
    tech_stack: string[];
    profession: string;
    wechat?: string;
    github: string;
    email: string;
    card_signature: string;
    card_message: string;
    AboutContent: PartialBlock[];
  } | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SiteState = {
  siteInfo: null,
  status: "idle",
  error: null,
};

const siteSlice = createSlice({
  name: "site",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.status = "loading";
    },
    setSuccess: (state, action: PayloadAction<SiteState["siteInfo"]>) => {
      state.status = "succeeded";
      state.siteInfo = action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const { setLoading, setSuccess, setError } = siteSlice.actions;

// 手动处理异步获取站点信息
export const fetchSiteInfo = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading());
  try {
    const res = await getSiteInfo();
    if (res.code === 0) {
      dispatch(setSuccess(res.data));
    } else {
      dispatch(setError(res.message || "获取站点信息失败"));
    }
  } catch (error) {
    dispatch(setError("获取站点信息失败"));
  }
};

export default siteSlice.reducer;
