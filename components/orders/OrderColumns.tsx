"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import {  Button } from "@radix-ui/themes";

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
    accessorKey: "customer",
    header: "Customer",
  },

  {
    accessorKey: "totalAmount",
    header: "Total (DA)",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
 {
  accessorKey: "action",
  header: "Actions", // optional but useful
  cell: ({ row }) => ( 
    <div>
     <Button className="left-5" size="1" color="red" variant="solid">Confirm </Button>
          <Button className="left-50" size="1" color="red" variant="soft">Cancel </Button>
               </div>


  ),
}
];
