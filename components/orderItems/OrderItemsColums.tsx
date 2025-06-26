"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import Image from "next/image"
import { MinusCircle, PlusCircle, Trash } from "lucide-react"
import { useState, useEffect } from "react"






export const DataFromParent = ({ data }: { data: string }) => {
  const [datas, setDatas] = useState<string>("")

  useEffect(() => {

    setDatas(data)
  }, []);

  return <p> ordevre id from parent {data}</p>

}


// Quantity Cell Component to rerender quantity


export const QuantityCell = ({
  initialQuantity,
  itemId,
  orderId,

}: {
  initialQuantity: number;
  itemId: string;
  orderId: string;
}) => {

  const [quantity, setQuantity] = useState(initialQuantity)
  const [isLoading, setIsLoading] = useState(false)

  //updates quantity in DB after u click minus or plus 
  const updateQuantityInDB = async (newQuantity: number) => {
    setIsLoading(true)

    try {
      await fetch(`/api/orders/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newQuantity,
          itemId,
          orderId,

        }),
      })
    } catch (error) {
      console.error('Failed to update quantity:', error)
    } finally {
      setIsLoading(false)
    }
  }
//when u click plus button
  const quantityIncrease = () => {

    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    updateQuantityInDB(newQuantity)

  }
//when u click minus button 
  const quantityDecrease = () => {
    if (quantity > 0) {
      // Prevent going below 1
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      updateQuantityInDB(newQuantity)

    }
  }

  return (
    <div className="flex gap-4 items-center">
      <MinusCircle onClick={quantityDecrease} className={`hover:text-red-1 cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      />
      <p>{quantity}</p>
      <PlusCircle onClick={quantityIncrease} className={`hover:text-red-1 cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      />
    </div>
  )
}

//products inside each specific order


export const columns: ColumnDef<OrderItemType>[] = [
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original.product

      if (!product) {
        return <span className="text-gray-400 italic">Unknown Product</span>
      }

      return (
        <Link href={`/products/${row.original.product._id}`} className="hover:text-red-1">
          {row.original.product.title}
        </Link>
      )
    },
  },
  {
    accessorKey: "media",
    header: "Image",
    cell: ({ row }) => (
      <Image src={row.original.product.media[0] || "/placeholder.svg"} alt="product image" width={150} height={150} />
    ),
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
    cell: ({ row }) => (

      <QuantityCell
        initialQuantity={row.original.quantity}
        itemId={row.original._id}
        orderId={row.original.orderId}
      />


    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (

      <p>{row.original.product.price * row.original.quantity}</p>
    )
  }
]
