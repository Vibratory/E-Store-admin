import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectToDB } from "@/lib/mongoDB";
import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",     //change to our website only
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// change for whats app messaging thing

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer, shipInfo } = await req.json();

    console.log(cartItems, customer, shipInfo)

    if (!cartItems || !shipInfo) {
      return new NextResponse("Not enough data to checkout", { status: 400 });
    }

    //FROM HERE
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["DZ", "CA"],
      },
      shipping_options: [
        { shipping_rate: "shr_1MfufhDgraNiyvtnDGef2uwK" },
        { shipping_rate: "shr_1OpHFHDgraNiyvtnOY4vDjuY" },
      ],
      line_items: cartItems.map((cartItem: any) => ({ //map items in cart
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
    });

    return NextResponse.json(session, { headers: corsHeaders });
    //TO HERE
  } catch (err) {
    console.log("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
