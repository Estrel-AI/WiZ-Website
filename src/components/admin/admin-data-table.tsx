"use client";

import { ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminButton, AdminCard, EmptyState, LoadingSkeleton } from "@/src/components/admin/admin-ui";
import { cn } from "@/src/lib/utils";

type Column<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  render: (row: T, index: number) => React.ReactNode;
  sortValue?: (row: T) => string | number;
};

export function AdminDataTable<T>({
  rows,
  columns,
  rowKey,
  loading,
  emptyTitle,
  emptyDescription,
  pageSize = 6,
  toolbar,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  loading?: boolean;
  emptyTitle: string;
  emptyDescription: string;
  pageSize?: number;
  toolbar?: React.ReactNode;
}) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const sortedRows = useMemo(() => {
    if (!sortKey) {
      return rows;
    }

    const column = columns.find((item) => item.key === sortKey);
    if (!column?.sortValue) {
      return rows;
    }

    return [...rows].sort((a, b) => {
      const aValue = column.sortValue?.(a) ?? "";
      const bValue = column.sortValue?.(b) ?? "";

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [columns, rows, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((value) => (value === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  };

  return (
    <AdminCard className="rounded-[10px] border border-slate-200/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      {toolbar}
      {loading ? <LoadingSkeleton rows={6} /> : null}
      {!loading && rows.length === 0 ? (
        <div className="p-5">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      ) : null}
      {!loading && rows.length > 0 ? (
        <>
          <div className="overflow-x-auto overflow-y-visible">
            <table className="min-w-full">
              <thead className="bg-slate-50/80">
                <tr className="border-b border-slate-200/80">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={cn("px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-600", column.className)}
                    >
                      {column.sortable ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 transition hover:text-slate-950"
                          onClick={() => handleSort(column.key)}
                        >
                          <span>{column.label}</span>
                          <ChevronsUpDown className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        column.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {pageRows.map((row, index) => (
                  <tr key={rowKey(row)} className="border-b border-slate-100 align-top transition hover:bg-slate-50/60">
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-4 text-sm text-slate-700">
                        {column.render(row, index)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3.5">
            <div className="text-sm text-slate-500">
              Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedRows.length)} of {sortedRows.length}
            </div>
            <div className="flex gap-2">
              <AdminButton
                variant="secondary"
                className="h-10 rounded-[10px] px-3"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </AdminButton>
              <AdminButton
                variant="secondary"
                className="h-10 rounded-[10px] px-3"
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </AdminButton>
            </div>
          </div>
        </>
      ) : null}
    </AdminCard>
  );
}


