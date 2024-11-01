import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function parseJwt(token: string) {
	if (!token) {
		return;
	}
	const base64Url = token.split(".")[1];
	const base64 = base64Url.replace("-", "+").replace("_", "/");
	return JSON.parse(atob(base64));
}

export function getEnumKeys<
	T extends string,
	TEnumValue extends string | number
>(enumVariable: { [key in T]: TEnumValue }) {
	return Object.keys(enumVariable) as Array<T>;
}
