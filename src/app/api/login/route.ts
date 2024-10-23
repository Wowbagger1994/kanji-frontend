import axiosClient from "@/lib/axiosClient";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const formData = await req.formData();
	try {
		const res = await axiosClient.post(
			"/auth/login",
			{
				email: formData.get("email"),
				password: formData.get("password"),
			},
			{ withCredentials: true }
		);
		axiosClient.defaults.headers.common[
			"Authorization"
		] = `Bearer ${res.data.accessToken}`;
		return NextResponse.json({ success: true });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: "Login failed" }, { status: 401 });
	}
}
