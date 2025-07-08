"use client"

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { UpdateStatus } from "./OrderUpdate";


export const columns: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "_id",
    header: "Order",
    cell: ({ row }) => {
      return (
        <Link
          href={`/orders/${row.original._id}`}
          className="hover:text-red-1"
        >
          {row.original._id}
        </Link>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const stutus = row.getValue("status") as string;
      return (
        <div>
          {stutus == "Confirmed" ?
            <p className="text-body-bold text-green-600">{stutus}</p>
            :
            <p className="text-body-bold text-red-600">{stutus}</p>}
        </div>
      );
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },

  //{
   // accessorKey: "totalAmount",
   // header: "Total (DA)",
  //},
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "action",
    header: "Actions", // optional but useful
    cell: ({ row }) => (
      <div>
        <UpdateStatus
          orderId={row.original._id}
          status={row.getValue("status") as string}

        />

      </div>


    ),
  }
];
