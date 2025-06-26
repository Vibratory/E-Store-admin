import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const POST = async (req: NextRequest) => {

    try {
        const { orderId, itemId, newQuantity } = await req.json();
        console.log("REQ:", { orderId, itemId, newQuantity });

        await connectToDB();









        
        const result = await Order.updateOne(
            {
                _id: new mongoose.Types.ObjectId(orderId),
                'products._id': new mongoose.Types.ObjectId(itemId),
            },

            {
                $set: {
                    'products.$.quantity': newQuantity
                }
            }

        )
        console.log("UPDATE RESULT:", result);

        return NextResponse.json({ status: 200 })

    } catch (err) {
        console.log('order id get error ', err)
        return NextResponse.json('in ternarl server error', { status: 500 })
    }
}