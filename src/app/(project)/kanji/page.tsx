import { KanjiTable } from "./kanji-table";
import {
	columnsKanji,
	columnsKanjiRelation,
	Kanji,
	KanjiRelation,
} from "./columns";
import axiosClient from "@/lib/axiosClient";
import { KanjiRelationshipTable } from "./kanji-relationships-table";
import { Session } from "next-auth";
import { auth } from "@/auth";

async function getData(session: Session): Promise<Kanji[]> {
	try {
		const res = await axiosClient.get("/kanji", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${session.accessToken}`,
			},
		});
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

async function getRelationData(session: Session): Promise<KanjiRelation[]> {
	try {
		const res = await axiosClient.get("/kanjirel", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${session?.accessToken}`,
			},
		});
		return res.data.map(
			(kanjiRel: any) =>
				({
					id: kanjiRel.id,
					kanji_result_id: kanjiRel.kanji_result_id,
					kanji_result: {
						...kanjiRel.kanji_result,
						id: kanjiRel.kanji_result.id,
						literal: kanjiRel.kanji_result.literal,
						codepoint_ucs: kanjiRel.kanji_result.codepoint_ucs,
						grade: kanjiRel.kanji_result.grade,
						meaning_en: kanjiRel.kanji_result.meaning_en,
					} as Kanji,
					kanji1_id: kanjiRel.kanji1_id,
					kanji1_literal: kanjiRel.kanji1_literal,
					kanji1: kanjiRel.kanji1
						? ({
								...kanjiRel.kanji1,
								id: kanjiRel.kanji1.id,
								literal: kanjiRel.kanji1.literal,
								codepoint_ucs: kanjiRel.kanji1.codepoint_ucs,
								grade: kanjiRel.kanji1.grade,
								meaning_en: kanjiRel.kanji1.meaning_en,
						  } as Kanji)
						: null,
					kanji2_id: kanjiRel.kanji2_id,
					kanji2_literal: kanjiRel.kanji2_literal,
					kanji2: kanjiRel.kanji2
						? ({
								...kanjiRel.kanji2,
								id: kanjiRel.kanji2.id,
								literal: kanjiRel.kanji2.literal,
								codepoint_ucs: kanjiRel.kanji2.codepoint_ucs,
								grade: kanjiRel.kanji2.grade,
								meaning_en: kanjiRel.kanji2.meaning_en,
						  } as Kanji)
						: null,
					codepoint_ucs_res: kanjiRel.codepoint_ucs_res,
					radical_type: kanjiRel.radical_type,
					relation_type: kanjiRel.relation_type,
				} as KanjiRelation)
		);
	} catch (error) {
		return [];
	}
}

export default async function KanjiPage() {
	const session = await auth();
	const data = await getData(session!);
	const relationData = await getRelationData(session!);

	return (
		<div>
			<div className="container mx-auto py-10">
				<KanjiTable columns={columnsKanji} data={data} />
			</div>
			<div className="container mx-auto py-10">
				<KanjiRelationshipTable
					columns={columnsKanjiRelation}
					data={relationData}
				/>
			</div>
			<div className="flex h-screen w-screen items-center justify-center bg-gray-50">
				<div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
					<div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
						<p>In development</p>
					</div>
				</div>
			</div>
		</div>
	);
}
