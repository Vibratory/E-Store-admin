import { type NextRequest, NextResponse } from "next/server"
//import { stripe } from "@/lib/stripe"
import { connectToDB } from "@/lib/mongoDB";
import { format } from "date-fns";
import Order from "@/lib/models/Order";
import Customer from "@/lib/models/Customer";
import axios from "axios";




const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer, shipInfo } = await req.json()

    console.log("Received checkout request:", { cartItems, customer, shipInfo })

    if (!cartItems || !shipInfo) {
      console.log("not enough data bitch")

      return NextResponse.json({ error: "Not enough data to checkout" }, { status: 400, headers: corsHeaders })
    }

    if (!cartItems.length) {

      console.log("no cart bitch")
      return NextResponse.json({ error: "Cart is empty" }, { status: 400, headers: corsHeaders })
    }
    console.log("probably worked bitch cuz we in the function whwere we put whats app messaging")

    //getting price of product  from db 





    //adding order to database
    await connectToDB();

    const newOrder = new Order({
      customerClerkId: customer.clerkId,
      products: cartItems,
      shippingAddress: shipInfo,
      shippingRate: "100", //yalidine api to get shipping price
      totalAmount: cartItems.totalAmount ? cartItems.totalAmount / 100 : 0,
    })

    await newOrder.save()

    let user = await Customer.findOne({ clerkId: customer.clerkId })

    if (user) {
      user.orders.push(newOrder._id)
    } else {
      user = new Customer({
        ...customer,
        orders: [newOrder._id],
      })
    }

    await user.save()


    //telegram message notification  api

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = process.env.TELEGRAM_CHAT_ID;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    console.log(cartItems.map((item: any) => item.item.title))

  
    const text = `
        Message : "new order please confirm "
         ${JSON.stringify(cartItems.map((cartItem: any) =>({ 
          title : cartItem.item.title, 
          quantity : cartItem.quantity,
          size: cartItem.size,
          color: cartItem.color,
        }))
      )}
      
          ${JSON.stringify(shipInfo)}`; // should include all details of order and time of order




    try {
      console.log("chat id is", chat_id)
      const response = await axios.post(telegramUrl, {
        chat_id,
        text,
      });
      if (response.data.ok) {
        return NextResponse.json("Cart is empty", { status: 200, headers: corsHeaders })

      } else {
        return NextResponse.json({ error: "message failed to send" }, { headers: corsHeaders })
      }

    } catch (error) {

      console.error('error sensing message to telegram', error)

      return NextResponse.json("error sending message", { headers: corsHeaders })

    }










    /*const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["DZ", "CA"],
      },
      shipping_options: [
        { shipping_rate: "shr_1MfufhDgraNiyvtnDGef2uwK" },
        { shipping_rate: "shr_1OpHFHDgraNiyvtnOY4vDjuY" },
      ],
      line_items: cartItems.map((cartItem: any) => ({
        price_data: {
          currency: "dzd",
          product_data: {
            name: cartItem.item.title,
            metadata: {
              productId: cartItem.item._id,
              ...(cartItem.size && { size: cartItem.size }),
              ...(cartItem.color && { color: cartItem.color }),
            },
          },
          unit_amount: cartItem.item.price * 100,
        },
        quantity: cartItem.quantity,
      })),
      client_reference_id: customer.clerkId,
      success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
    })

    console.log("Stripe session created:", session.id)*/

    return NextResponse.json('it worked probably', { headers: corsHeaders })
  } catch (err) {
    console.error("[checkout_POST]", err)
    return NextResponse.json(
      { error: "Internal Server Error", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500, headers: corsHeaders },
    )
  }
}
