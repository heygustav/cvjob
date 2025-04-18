
import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface VirtualizedTableProps<T> {
  data: T[];
  columns: {
    header: string;
    key: string;
    render: (item: T) => React.ReactNode;
  }[];
  estimateSize?: number;
  headerHeight?: number;
}

export function VirtualizedTable<T>({
  data,
  columns,
  estimateSize = 50,
  headerHeight = 40,
}: VirtualizedTableProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="max-h-[600px] overflow-auto">
      <Table>
        <TableHeader style={{ height: headerHeight }}>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => (
              <TableRow
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render(data[virtualRow.index])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </div>
        </TableBody>
      </Table>
    </div>
  );
}
