export const HOST=import.meta.env.VITE_BACKEND_URL;

export const AUTH_ROUTES="api/v1/auth"
export const SIGNUP_ROUTE=`${AUTH_ROUTES}/signup`
export const LOGIN_ROUTE=`${AUTH_ROUTES}/login`
export const GET_USERINFO=`${AUTH_ROUTES}/userInfo`
export const UPDATE_PROFILE=`${AUTH_ROUTES}/update-profile`
export const ADD_PROFILE_IMAGE_ROUTE=`${AUTH_ROUTES}/add-profile-avatar`
export const DELETE_PROFILE_IMAGE_ROUTE=`${AUTH_ROUTES}/delete-profile-avatar`
export const LOGOUT_ROUTE=`${AUTH_ROUTES}/logout`

