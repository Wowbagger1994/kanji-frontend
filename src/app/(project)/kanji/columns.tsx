"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import KanjivgAnimate from "../../../lib/KanjivgAnimate";
import KanjiViewer from "../../../lib/kanjiViewer";
import { deleteRelationshipKanji, saveRelationshipKanji } from "./kanji-rel";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RadicalType } from "@/lib/enums/radicalType";
import { RelationType } from "@/lib/enums/relationType";
import { getEnumKeys } from "@/lib/utils";
import { useSession } from "next-auth/react";

export type Kanji = {
	id: string;
	literal: string;
	codepoint_ucs: string | null;
	grade: number;
	meaning_en: string[];
};

export const columnsKanji: ColumnDef<Kanji>[] = [
	{
		id: "actions",
		cell: ({ row }) => {
			const kanji = row.original;
			const [isPopoverOpen, setIsPopoverOpen] = useState(false);
			const [isHovered, setIsHovered] = useState(false);
			new KanjivgAnimate(".kanjiVG", 700);

			return (
				<DropdownMenu
					open={isHovered && isPopoverOpen ? true : undefined}
				>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(kanji.id)
							}
						>
							Copy kanji ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<div
							onMouseEnter={() => setIsPopoverOpen(true)}
							onMouseLeave={() => setIsPopoverOpen(false)}
						>
							<DropdownMenuItem
								onMouseEnter={() => {
									setIsHovered(true);
									// setTimeout(() => {
									// 	debugger;
									// }, 5000);
								}}
								onMouseLeave={() => setIsHovered(false)}
							>
								View kanji details
								{isHovered && (
									<Popover open={isHovered}>
										<PopoverTrigger className="text-sm"></PopoverTrigger>
										<PopoverContent className="bg-transparent bg-opacity-0 border-none p-0 outline-none">
											<Card>
												<CardHeader>
													<CardTitle>
														{kanji.literal}
													</CardTitle>
													<CardDescription>
														UCS Codepoint:{" "}
														{kanji.codepoint_ucs}
													</CardDescription>
												</CardHeader>
												<CardContent>
													<KanjiViewer
														codepoint_ucs={
															kanji.codepoint_ucs ??
															""
														}
													/>
													{/* <Image
														width={109}
														height={109}
														src={`/assets/kanji/0${kanji.codepoint_ucs}.svg`}
														alt={kanji.literal}
													/> */}
													<button
														id="animate"
														className="kanjivg-button"
														data-kanjivg-target="#kanji-svg"
													>
														Animate
													</button>
													<Collapsible>
														<CollapsibleTrigger>
															<Button
																variant="ghost"
																size="sm"
															>
																<span>
																	<h4 className="text-sm font-semibold">
																		English
																		Meaning
																	</h4>
																</span>
																<CaretSortIcon className="h-4 w-4" />
															</Button>
														</CollapsibleTrigger>
														<CollapsibleContent>
															{kanji.meaning_en.map(
																(
																	meaning: string
																) => (
																	<p
																		key={
																			meaning
																		}
																	>
																		{
																			meaning
																		}
																	</p>
																)
															)}
														</CollapsibleContent>
													</Collapsible>
												</CardContent>
												<CardFooter>
													<p>Grade: {kanji.grade}</p>
												</CardFooter>
											</Card>
										</PopoverContent>
									</Popover>
								)}
							</DropdownMenuItem>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
	{
		accessorKey: "literal",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Literal
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "codepoint_ucs",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					UCS Codepoint
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "grade",
		header: "Grade",
	},
];

export type KanjiRelation = {
	id: number;
	kanji_result_id: number;
	kanji_result: Kanji;
	kanji1_id?: number;
	kanji1: Kanji;
	kanji1_literal?: string;
	kanji2_id?: number;
	kanji2: Kanji;
	kanji2_literal?: string;
	codepoint_ucs_res: string;
	radical_type?: string;
	relation_type: string;
};

export const columnsKanjiRelation: ColumnDef<KanjiRelation>[] = [
	{
		accessorKey: "kanji_result.literal",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Kanji Result
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
			// cell: ({ row }) => {
			// 	const kanjiRel = row.original;
			// 	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
			// 	const [isHovered, setIsHovered] = useState(false);

			// 	return <input></input>;
			// },
		},
	},
	{
		accessorKey: "codepoint_ucs_res",
		header: "UCS Codepoint",
	},
	{
		accessorKey: "kanji1_literal",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Kanji1
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "kanji2_literal",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Kanji2
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "radical_type",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Radical Type
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const kanjiRel = row.original;
			return (
				<Select value={kanjiRel.radical_type ?? undefined}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select a radical type" />
					</SelectTrigger>
					<SelectContent>
						{getEnumKeys(RadicalType).map((radicalType) => (
							<SelectItem value={radicalType}>
								{radicalType}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			);
		},
	},
	{
		accessorKey: "relation_type",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Relationship Type
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const kanjiRel = row.original;
			return (
				<Select value={kanjiRel.relation_type ?? undefined}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select a relation type" />
					</SelectTrigger>
					<SelectContent>
						{getEnumKeys(RelationType).map((relationType) => (
							<SelectItem value={relationType}>
								{relationType}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			);
		},
	},
	{
		id: "save",
		cell: ({ row }) => {
			const { data: session } = useSession();

			const kanjiRel = row.original;
			const body = {
				kanji_result_id: kanjiRel.kanji_result_id,
				kanji1_id: kanjiRel.kanji1_id,
				kanji2_id: kanjiRel.kanji2_id,
				codepoint_ucs_res: kanjiRel.codepoint_ucs_res,
				radical_type: kanjiRel.radical_type,
				relation_type: kanjiRel.relation_type,
			};
			const updateKanjirel = saveRelationshipKanji.bind(
				null,
				kanjiRel.id,
				body,
				session ? session.accessToken : null
			);
			return (
				<form action={updateKanjirel}>
					<Button variant="ghost">Save</Button>
				</form>
			);
		},
	},
	{
		id: "delete",
		cell: ({ row }) => {
			const kanjiRel = row.original;
			const { data: session } = useSession();
			const body = {
				kanji_result_id: kanjiRel.kanji_result_id,
				kanji1_id: kanjiRel.kanji1_id,
				kanji2_id: kanjiRel.kanji2_id,
				codepoint_ucs_res: kanjiRel.codepoint_ucs_res,
				radical_type: kanjiRel.radical_type,
				relation_type: kanjiRel.relation_type,
			};
			const deleteKanjiRel = deleteRelationshipKanji.bind(
				null,
				kanjiRel.id,
				session ? session.accessToken : null
			);
			return (
				<Dialog>
					<DialogTrigger>Delete</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Are you absolutely sure?</DialogTitle>
							<DialogDescription>
								This action cannot be undone.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant="secondary">
									No
								</Button>
							</DialogClose>
							<DialogClose asChild>
								<form action={deleteKanjiRel}>
									<Button type="submit">Yes</Button>
								</form>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			);
		},
	},
];
