// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  role: string | null;
  email: string | null;
  userId : number | null
}

const initialState: UserState = {
  role: null,
  email: null,
  userId :null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.userId = action.payload.userId;
    },
    logoutUser(state) {
      state.role = null;
      state.email = null;
      state.userId = null;
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
