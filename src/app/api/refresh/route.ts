import axiosClient from "@/lib/axiosClient";
import { NextResponse } from "next/server";

export async function POST() {
	const res = await axiosClient.post("/auth/refresh", null);
	axiosClient.defaults.headers.common[
		"Authorization"
	] = `Bearer ${res.data.accessToken}`;
	return NextResponse.json({ success: true });
}
