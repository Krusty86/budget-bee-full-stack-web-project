export const selectUserProfile = (state) => state.user.profile;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserProfileUpdating = (state) => state.user.updatingProfile;
export const selectUserOtpRequesting = (state) => state.user.requestingOtp;
export const selectUserPasswordUpdating = (state) =>
  state.user.updatingPassword;
export const selectUserOtpRequested = (state) => state.user.otpRequested;
export const selectUserError = (state) => state.user.error;
export const selectUserSuccessMessage = (state) => state.user.successMessage;
