import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isLeftModalOpen: boolean;
  isTopModalOpen: boolean;
  isArticleLeftModalOpen: boolean;
  currentModalType: "left" | "top" | "articleLeft" | null;
}

const initialState: ModalState = {
  isLeftModalOpen: false,
  isTopModalOpen: false,
  isArticleLeftModalOpen: false,
  currentModalType: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    // 打开指定类型的弹窗
    openModal: (
      state,
      action: PayloadAction<"left" | "top" | "articleLeft">
    ) => {
      // 关闭所有其他弹窗
      state.isLeftModalOpen = false;
      state.isTopModalOpen = false;
      state.isArticleLeftModalOpen = false;

      // 打开指定弹窗
      switch (action.payload) {
        case "left":
          state.isLeftModalOpen = true;
          break;
        case "top":
          state.isTopModalOpen = true;
          break;
        case "articleLeft":
          state.isArticleLeftModalOpen = true;
          break;
      }
      state.currentModalType = action.payload;
    },

    // 关闭当前弹窗
    closeModal: (state) => {
      state.isLeftModalOpen = false;
      state.isTopModalOpen = false;
      state.isArticleLeftModalOpen = false;
      state.currentModalType = null;
    },

    // 切换指定弹窗的显示状态
    toggleModal: (
      state,
      action: PayloadAction<"left" | "top" | "articleLeft">
    ) => {
      const isCurrentlyOpen = state.currentModalType === action.payload;

      // 关闭所有弹窗
      state.isLeftModalOpen = false;
      state.isTopModalOpen = false;
      state.isArticleLeftModalOpen = false;

      // 如果当前弹窗已打开，则完全关闭；否则打开新的弹窗
      if (!isCurrentlyOpen) {
        switch (action.payload) {
          case "left":
            state.isLeftModalOpen = true;
            break;
          case "top":
            state.isTopModalOpen = true;
            break;
          case "articleLeft":
            state.isArticleLeftModalOpen = true;
            break;
        }
        state.currentModalType = action.payload;
      } else {
        state.currentModalType = null;
      }
    },
  },
});

export const { openModal, closeModal, toggleModal } = modalSlice.actions;

export default modalSlice.reducer;
