export const selectToken = (state) => state.auth.userToken;

export const selectCurrentUser = (state) => ({
    userId: state.auth.userId,
    username: state.auth.username,
    fullname: state.auth.fullname,
});