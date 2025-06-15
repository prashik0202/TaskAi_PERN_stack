import { userApiService } from "@/services/userApiService";
import type { User } from "@/types/types";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface UserStateProps {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserStateProps = {
  user: null,
  error: null,
  loading: false,
};

const UserSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    resetUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetching user details
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.error = null;
        state.loading = false;
        state.user = action.payload;
      })
      // signIn user
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(signInUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.error = null;
        state.loading = false;
        state.user = action.payload;
      })
      // signUp user
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(signUpUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.error = null;
        state.loading = false;
        state.user = action.payload;
      })
      // logout user:
      .addCase(signOutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.error = null;
        state.loading = false;
        state.user = null;
      })
      // update user:
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.error = null;
        state.loading = false;
        state.user = action.payload;
      });
  },
});

export const fetchUser = createAsyncThunk(
  "user/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const fetchedUser = await userApiService.getUser();
      return fetchedUser.data;
    } catch (error) {
      if (error instanceof Error || error instanceof AxiosError) {
        return rejectWithValue(error.message);
      }
      // Optionally handle unexpected errors
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const signInUser = createAsyncThunk(
  "user/signIn",
  async (
    userData: Pick<User, "email"> & { password: string },
    { rejectWithValue }
  ) => {
    try {
      const signedInUser = await userApiService.signInUser(userData);
      return signedInUser.data;
    } catch (error) {
      if (error instanceof Error || error instanceof AxiosError) {
        return rejectWithValue(error.message);
      }
      // Optionally handle unexpected errors
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const signUpUser = createAsyncThunk(
  "user/signUp",
  async (
    userData: Pick<User, "email" | "name"> & { password: string },
    { rejectWithValue }
  ) => {
    try {
      const signedInUser = await userApiService.signUpUser(userData);
      return signedInUser.data;
    } catch (error) {
      if (error instanceof Error || error instanceof AxiosError) {
        return rejectWithValue(error.message);
      }
      // Optionally handle unexpected errors
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const signOutUser = createAsyncThunk(
  "user/signOut",
  async (_, { rejectWithValue }) => {
    try {
      const signedInUser = await userApiService.logout();
      return signedInUser.data;
    } catch (error) {
      if (error instanceof Error || error instanceof AxiosError) {
        return rejectWithValue(error.message);
      }
      // Optionally handle unexpected errors
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async (userData: User, { rejectWithValue }) => {
    try {
      const signedInUser = await userApiService.updateUserData(
        userData,
        userData.id
      );
      return signedInUser.data;
    } catch (error) {
      if (error instanceof Error || error instanceof AxiosError) {
        return rejectWithValue(error.message);
      }
      // Optionally handle unexpected errors
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const { resetUser, setUser } = UserSlice.actions;
export default UserSlice.reducer;
