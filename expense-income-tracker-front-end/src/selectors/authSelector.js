export const selectToken = (state) => state.auth.userToken;

export const selectCurrentUser = (state) => ({
  userId: state.auth.userId,
  username: state.auth.username,
  fullname: state.auth.fullname,
});
//Login
export const selectAuthError = (state) => state.auth.error;

export const selectAuthSuccessMessage = (state) => state.auth.successMessage;

export const selectAuthLoading = (state) => state.auth.loading;

//Register
export const selectRegisterSuccess = (state) => state.auth.registerSuccess;

// Password Reset Selectors
export const selectPasswordResetRequestLoading = (state) =>
  state.auth.passwordResetRequestLoading;

export const selectPasswordResetRequestSuccess = (state) =>
  state.auth.passwordResetRequestSuccess;

export const selectPasswordResetLoading = (state) =>
  state.auth.passwordResetLoading;

export const selectPasswordResetSuccess = (state) =>
  state.auth.passwordResetSuccess;

export const selectPasswordResetError = (state) =>
  state.auth.passwordResetError;
