import axios from "axios";
import { SubmitButton } from "../submit-button";
import { DataTable } from "./data-table";
import { Kanji, columns } from "./columns";
import axiosClient from "@/lib/axiosClient";
import { redirect } from "next/navigation";

async function getData(): Promise<Kanji[]> {
	try {
		const res = await axiosClient.get("/kanji");
		return res.data.map(
			(kanji: any) =>
				({
					...kanji,
					id: kanji.id,
					literal: kanji.literal,
					codepoint_ucs: kanji.codepoint_ucs,
					grade: kanji.grade,
					meaning_en: kanji.meaning_en,
				} as Kanji)
		);
	} catch (error) {
		return [];
	}
}

export default async function KanjiPage() {
	const data = await getData();

	return (
		<div>
			<div className="container mx-auto py-10">
				<DataTable columns={columns} data={data} />
			</div>
			<div className="flex h-screen w-screen items-center justify-center bg-gray-50">
				<div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
					<div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
						<p>In development</p>
						<form
							action={async (formData: FormData) => {
								"use server";

								const res = await axios.post(
									process.env.FRONTEND_PROXY + "/api/refresh"
								);
								const random = Math.random();
								redirect(`/kanji?${random}`);
							}}
						>
							<SubmitButton>Refresh</SubmitButton>
						</form>
						<form
							action={async (formData: FormData) => {
								"use server";

								const res = await axios.post(
									process.env.FRONTEND_PROXY + "/api/logout"
								);
							}}
						>
							<SubmitButton>Logout</SubmitButton>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
