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
import KanjivgAnimate from "../../lib/KanjivgAnimate";
import KanjiViewer from "../../lib/kanjiViewer";
import Image from "next/image";

export type Kanji = {
	id: string;
	literal: string;
	codepoint_ucs: string | null;
	grade: number;
	meaning_en: string[];
};

export const columns: ColumnDef<Kanji>[] = [
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
