import Cookies from "js-cookie";

export const getToken = () => Cookies.get("token");
export const setToken = (token: string) => Cookies.set("token", token, { expires: 1 });
export const removeToken = () => Cookies.remove("token");
export const isLoggedIn = () => !!getToken();