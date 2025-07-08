import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/lib/models/Product";

export const POST = async (req: NextRequest) => {
    let result;
    await connectToDB();

    try {
        const { orderId, itemId, newQuantity, action, statuses, total, status } = await req.json();

        console.log("orderId", orderId, "itemId", itemId, "newQuantity", newQuantity, "action", action, "statuses", statuses, "total is ", total, "current stat", status);

        //update status in order table
        if (action == "status") {
            result = await Order.updateOne(

                { _id: new mongoose.Types.ObjectId(orderId) }, { $set: { status: statuses } }
            )
            if (statuses === "Confirmed") {
                //get all products and quantitis from order id and cycle thorugh each peoduct and modify his quantity

                const order = await Order.findById(orderId).populate("products.product");

                if (!order) throw new Error("Order not found");

                for (const item of order.products) {
                    const productTable = item.product; // product object
                    const orderQuantity = item.quantity; // quantity ordered of product 

                    // convert stock from string to int
                    const currentStock = parseInt(productTable.stock || "0", 10)
                    let newStock = currentStock - orderQuantity;
                    //make sure we dont go negative on stock
                    if (newStock < 0) {
                        newStock = 0;
                    }
                    await Product.findByIdAndUpdate(productTable._id, {
                        stock: newStock.toString(),
                        updateAt: new Date()
                    });

                    console.log(`Updated ${productTable.title}: ${currentStock} → ${newStock}`);

                }
            }

            if (statuses === "Canceled" && status === "Confirmed") {
                //get all products and quantitis from order id and cycle thorugh each peoduct and modify his quantity

                const order = await Order.findById(orderId).populate("products.product");

                if (!order) throw new Error("Order not found");

                for (const item of order.products) {
                    const productTable = item.product; // product object
                    const orderQuantity = item.quantity; // quantity ordered of product 

                    // convert stock from string to int
                    const currentStock = parseInt(productTable.stock || "0", 10)
                    const newStock = orderQuantity + currentStock;

                    await Product.findByIdAndUpdate(productTable._id, {

                        stock: newStock.toString(),
                        updateAt: new Date()
                    });

                    console.log(`Updated ${productTable.title}: ${currentStock} → ${newStock}`);

                }
            }
            console.log("All product stocks updated.");





        } else if (itemId && newQuantity !== undefined) {

            //else update quantity in order table
            result = await Order.updateOne(
                { _id: new mongoose.Types.ObjectId(orderId), 'products._id': new mongoose.Types.ObjectId(itemId), },

                {
                    $set: {
                        'products.$.quantity': newQuantity,
                        totalAmount: total
                    }
                }

            )
        }


        console.log("UPDATE RESULT:", result);

        return NextResponse.json({ status: 200, result })

    } catch (err) {
        console.log('order id get error ', err)
        return NextResponse.json('in ternarl server error', { status: 500 })
    }
}