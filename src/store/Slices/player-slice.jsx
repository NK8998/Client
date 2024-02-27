import { createSlice } from "@reduxjs/toolkit";

const playerSlicer = createSlice({
  name: "player",
  initialState: {
    player: {},
  },
  reducers: {
    updatePlayer: (state, action) => {
      state.player = action.payload;
    },
  },
});

export const { updatePlayer } = playerSlicer.actions;
export default playerSlicer.reducer;
