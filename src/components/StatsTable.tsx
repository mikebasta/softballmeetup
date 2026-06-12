'use client';

import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
import { useState } from 'react';
import { PlayerTotalsRow } from '@/lib/leaderboard';
import { formatRate } from '@/lib/stats';

const col = createColumnHelper<PlayerTotalsRow>();

const countCol = (key: keyof PlayerTotalsRow, label: string) =>
  col.accessor((row) => row[key], {
    id: key,
    header: label,
    cell: (info) => info.getValue<number>(),
  });

const rateCol = (key: keyof PlayerTotalsRow, label: string) =>
  col.accessor((row) => row[key], {
    id: key,
    header: label,
    cell: (info) => formatRate(info.getValue<number>()),
  });

const columns = [
  col.accessor('name', {
    header: 'Player',
    cell: (info) => (
      <Link
        href={`/players/${info.row.original.playerId}`}
        className="font-medium text-green-800 hover:underline"
      >
        {info.getValue()}
      </Link>
    ),
  }),
  countCol('games', 'GP'),
  countCol('atBats', 'AB'),
  countCol('hits', 'H'),
  countCol('singles', '1B'),
  countCol('doubles', '2B'),
  countCol('triples', '3B'),
  countCol('hr', 'HR'),
  countCol('rbi', 'RBI'),
  countCol('runs', 'R'),
  countCol('bb', 'BB'),
  countCol('k', 'K'),
  countCol('sb', 'SB'),
  countCol('cs', 'CS'),
  rateCol('avg', 'AVG'),
  rateCol('obp', 'OBP'),
  rateCol('slg', 'SLG'),
  rateCol('ops', 'OPS'),
];

export default function StatsTable({ rows }: { rows: PlayerTotalsRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'ops', desc: true },
  ]);

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b-2 border-green-800">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer select-none whitespace-nowrap px-2 py-2 text-left hover:bg-green-50"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {{ asc: ' ▲', desc: ' ▼' }[
                    header.column.getIsSorted() as string
                  ] ?? ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-200 hover:bg-green-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="whitespace-nowrap px-2 py-1.5">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="py-8 text-center text-gray-500">No stats yet.</p>
      )}
    </div>
  );
}
