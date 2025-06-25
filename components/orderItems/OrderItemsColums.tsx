"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import Image from "next/image";

export const columns: ColumnDef<OrderItemType>[] = [
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {

      const product = row.original.product;

      if (!product) {
        return <span className="text-gray-400 italic">Unknown Product</span>;
      }

      return (
        <Link
          href={`/products/${row.original.product._id}`}
          className="hover:text-red-1"
        >
          {row.original.product.title}

        </Link>
      );
    },
  },
  {
    accessorKey: "media",
    header: "Image",
    cell: ({row})=>(
      <Image
      src={row.original.product.media[0]}
      alt="product image"
      width={150}
      height={150}
      />
    )
  },
  {
    accessorKey: "color",
    header: "Color",
  },

  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
    {
    accessorKey: "price",
    header: "Price",
    cell: ({row})=>(
      <p> {row.original.product.price} DA</p>
    )
  },

];
