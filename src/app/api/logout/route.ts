import axiosClient from "@/lib/axiosClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const res = await axiosClient.post("/auth/logout", null);
	const response = new NextResponse(res.data);
	if (res.headers["Authentication"])
		axiosClient.defaults.headers.common["Authorization"] = "";
	return response;
}
