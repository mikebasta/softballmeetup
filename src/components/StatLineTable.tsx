import Link from 'next/link';
import { CountingStats, derive, formatRate, sumCountingStats } from '@/lib/stats';

export interface StatLineTableRow {
  key: string;
  label: string;
  href?: string;
  line: CountingStats;
}

const HEADERS = ['AB', 'H', '1B', '2B', '3B', 'HR', 'RBI', 'R', 'BB', 'K', 'SB', 'CS', 'AVG', 'OPS'];

/** Server-rendered stat table for box scores and game logs. */
export default function StatLineTable({
  rows,
  labelHeader,
  footerLabel,
}: {
  rows: StatLineTableRow[];
  labelHeader: string;
  footerLabel?: string;
}) {
  const cells = (line: CountingStats) => {
    const d = derive(line);
    return [
      d.atBats,
      d.hits,
      line.singles,
      line.doubles,
      line.triples,
      line.hr,
      line.rbi,
      line.runs,
      line.bb,
      line.k,
      line.sb,
      line.cs,
      formatRate(d.avg),
      formatRate(d.ops),
    ];
  };

  if (rows.length === 0) {
    return <p className="py-8 text-center text-gray-500">No stats recorded.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-green-800">
            <th className="whitespace-nowrap px-2 py-2 text-left">{labelHeader}</th>
            {HEADERS.map((h) => (
              <th key={h} className="whitespace-nowrap px-2 py-2 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-gray-200 hover:bg-green-50">
              <td className="whitespace-nowrap px-2 py-1.5">
                {row.href ? (
                  <Link href={row.href} className="font-medium text-green-800 hover:underline">
                    {row.label}
                  </Link>
                ) : (
                  <span className="font-medium">{row.label}</span>
                )}
              </td>
              {cells(row.line).map((value, i) => (
                <td key={i} className="whitespace-nowrap px-2 py-1.5">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {footerLabel && (
          <tfoot>
            <tr className="border-t-2 border-green-800 font-semibold">
              <td className="whitespace-nowrap px-2 py-2">{footerLabel}</td>
              {cells(sumCountingStats(rows.map((r) => r.line))).map((value, i) => (
                <td key={i} className="whitespace-nowrap px-2 py-2">
                  {value}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
