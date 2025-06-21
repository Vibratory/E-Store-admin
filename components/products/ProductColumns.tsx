"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";
import Image from "next/image";

export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/products/${row.original._id}`}
        className="hover:text-red-1"
      >
        {row.original.title}
      </Link>
    ),
  },
   {
    accessorKey: "media",
    header: "Picture",
    cell: ({row}) => (
      <Image
     width={150}
  height={150}
  sizes="(max-width: 768px) 100vw, 300px"
       style={{ objectFit: 'contain' }}  
       alt="Product Image"
        src={row.original.media[0]}>

        </Image>

    )
  
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "collections",
    header: "Collections",
    cell: ({ row }) => row.original.collections.map((collection) => collection.title).join(", "),
  },
  {
    accessorKey: "price",
    header: "Price (DA)",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    id: "actions",
    cell: ({ row }) => <Delete item="product" id={row.original._id} />,
  },
];
