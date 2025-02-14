import { Badge } from "@/components/ui/badge";
import { task } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<task>[] = [
  {
    id: "index",
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
  },
  {
    id: "title",
    accessorKey: "title",
    header: "Titulo",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("description")}</div>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className="capitalize" variant={row.getValue("status")}>
        {row.getValue("status")}
      </Badge>
    ),
  },
];
