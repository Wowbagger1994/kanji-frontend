import axios from "axios";
import { cookies } from "next/headers";

const axiosClient = axios.create({
	baseURL: process.env.BACKEND_URL,
	timeout: 5000,
	headers: {
		"Content-Type": "application/json",
	},
});

export const getCookie = async (name: string) => {
	return cookies().get(name)?.value ?? "";
};

axiosClient.interceptors.request.use(async function (config) {
	// const token = await getCookie("Authentication");
	// // You can set the cookie in the Authentication instead
	// // Depends on how you want to backend to read the accessToken
	// if (token) config.headers.Cookie = `Authentication=Bearer ${token}`;
	return config;
});

export default axiosClient;
