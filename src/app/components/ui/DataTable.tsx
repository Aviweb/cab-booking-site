"use client";

import React from "react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
  emptyDescription?: string;
  actionColumn?: (row: T) => React.ReactNode;
  actionColumnLabel?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
}

export default function DataTable<T = Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "No data available",
  emptyDescription,
  actionColumn,
  actionColumnLabel,
  className = "",
  headerClassName = "",
  rowClassName = "",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
        {emptyDescription && (
          <p className="text-gray-400 text-sm mt-2">{emptyDescription}</p>
        )}
      </div>
    );
  }

  const getRowClassName = (row: T, index: number): string => {
    const baseClass = "even:bg-gray-50";
    if (typeof rowClassName === "function") {
      return `${baseClass} ${rowClassName(row, index)}`;
    }
    return `${baseClass} ${rowClassName || ""}`;
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                scope="col"
                className={`px-3 py-3.5 text-left text-sm font-semibold text-gray-900 ${
                  column.className || ""
                } ${headerClassName}`}
              >
                {column.label}
              </th>
            ))}
            {actionColumn && (
              <th
                scope="col"
                className={`px-3 py-3.5 text-left text-sm font-semibold text-gray-900 ${headerClassName}`}
              >
                {actionColumnLabel || "Actions"}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={keyExtractor(row)} className={getRowClassName(row, index)}>
              {columns.map((column) => {
                const value = row[column.key as keyof T];
                return (
                  <td
                    key={String(column.key)}
                    className="px-3 py-4 text-sm whitespace-nowrap text-gray-500"
                  >
                    {column.render
                      ? column.render(value, row)
                      : String(value || "")}
                  </td>
                );
              })}
              {actionColumn && (
                <td className="px-3 py-4 text-sm whitespace-nowrap">
                  {actionColumn(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
