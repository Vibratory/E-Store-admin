
import { DataTable } from "@/components/custom ui/DataTable"
import { columns, DataFromParent, QuantityCell } from "@/components/orderItems/OrderItemsColums"
import { formatDZD } from "@/lib/actions/actions"

const OrderDetails = async ({ params }: { params: { orderId: string } }) => {

  const res = await fetch(`${process.env.ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`)

  const { orderDetails, customer } = await res.json()
  const { city, state, zip } = orderDetails.shippingAddress


//addd update price in DB


// get and show new total price of order in case admin updated quantity but db still same

const totalPrice = orderDetails.products.reduce((acc: number, item: any) => {
  
 const price = Number(item.product?.price) || 0;
  const quantity = Number(item.quantity) || 0;

  return acc + price * quantity;
}, 0);



// Inject Order ID into products so i can update qauntity in the order table

const productsWithOrderId = orderDetails.products.map((item: any) => ({
  ...item,
  orderId: orderDetails._id, // silently attach it
  
}));



  //Specific order page


  return (
    <div className="flex flex-col p-10 gap-5">
      <p className="text-base-bold">
        Order ID: <span className="text-base-medium">{orderDetails._id}</span>
      </p>
      <p className="text-base-bold">
        Customer name: <span className="text-base-medium">{customer.name}</span>
      </p>
      <p className="text-base-bold">
        Shipping address: <span className="text-base-medium">, {city}, {state}, {zip}</span>
      </p>
     
      <p className="text-base-bold">
        Shipping rate: <span className="text-base-medium">{orderDetails.shippingRate}</span>
      </p>
       <p className="text-base-bold text-green-400 ">
        Total: <span className="text-base-medium">{formatDZD(totalPrice)}</span>
      </p>

      <DataTable columns={columns} data={productsWithOrderId} searchKey="product" />


    </div>
  )
}

export default OrderDetails