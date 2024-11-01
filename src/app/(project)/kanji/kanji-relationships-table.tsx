"use client";

import * as React from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function KanjiRelationshipTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [pagination, setPagination] = React.useState({
		pageIndex: 0, //default page index
		pageSize: 100, //default page size
	});

	const table = useReactTable({
		data,
		columns,
		getPaginationRowModel: getPaginationRowModel(),
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			pagination,
		},
	});

	return (
		<div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.id ===
											"kanji_result_literal" ? (
												<Input
													placeholder="Filter kanji..."
													value={
														(table
															.getColumn(
																"kanji_result_literal"
															)
															?.getFilterValue() as string) ??
														""
													}
													onChange={(event) =>
														table
															.getColumn(
																"kanji_result_literal"
															)
															?.setFilterValue(
																event.target
																	.value
															)
													}
													className="max-w-sm"
												/>
											) : null}
											{header.id === "kanji1_literal" ? (
												<Input
													placeholder="Filter kanji..."
													value={
														(table
															.getColumn(
																"kanji1_literal"
															)
															?.getFilterValue() as string) ??
														""
													}
													onChange={(event) =>
														table
															.getColumn(
																"kanji1_literal"
															)
															?.setFilterValue(
																event.target
																	.value
															)
													}
													className="max-w-sm"
												/>
											) : null}
											{header.id === "kanji2_literal" ? (
												<Input
													placeholder="Filter kanji..."
													value={
														(table
															.getColumn(
																"kanji2_literal"
															)
															?.getFilterValue() as string) ??
														""
													}
													onChange={(event) =>
														table
															.getColumn(
																"kanji2_literal"
															)
															?.setFilterValue(
																event.target
																	.value
															)
													}
													className="max-w-sm"
												/>
											) : null}
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<span>
					<div>
						Page{" "}
						<strong>
							{pagination.pageIndex + 1} of {table.getPageCount()}
						</strong>
					</div>
					Total: {" " + data.length}
				</span>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
