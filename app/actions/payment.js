"use server";

import {createClient} from "@/utils/supabase/server";
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay client
const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })

// ACTION 1: Create a Razorpay Order
export async function createOrder(amount, currency = "INR") {
    try {
      const options = {
        amount: amount * 100, // Amount in paise
        currency,
        receipt: `receipt_${Date.now()}`,
      }
  
      // Create the order
      const order = await razorpay.orders.create(options)
      
      if (!order) {
        throw new Error("Failed to create order")
      }
      
      // Return the order details to the client
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      }
    } catch (error) {
      console.error("Error creating Razorpay order:", error.message)
      return { error: error.message }
    }
  }

// ACTION 2: Verify Payment and Update Database
// This is the most critical step
export async function verifyPaymentAndUpdateDatabase(paymentData) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData
    const supabase = await createClient()
  
    // 1. Get the logged-in user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: "User not authenticated" }
    }
  
    // 2. Verify the Razorpay signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex")
  
    if (expectedSignature !== razorpay_signature) {
      return { error: "Invalid payment signature" }
    }
  
    // 3. Signature is valid. Save payment to Supabase.
    try {
      // Get the order details to find the amount
      const orderDetails = await razorpay.orders.fetch(razorpay_order_id)
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
      
      // Check if member record exists, use maybeSingle to avoid error if not found
      let { data: memberData, error: memberError } = await supabase
        .from("members")
        .select("id")
        .eq("profile_id", user.id)
        .maybeSingle();

      // If member doesn't exist, create one
      if (!memberData && !memberError) {
        const membership_id = `MEM${Math.floor(Math.random() * 1000000)}`;
        const { data: newMember, error: createError } = await supabase
          .from("members")
          .insert([
            {
              profile_id: user.id,
              member_id: membership_id,
              membership_type: "member", // Default to member, will be updated to "paid" below
            }
          ])
          .select("id")
          .single();

        if (createError || !newMember) {
          console.error("Failed to create member record:", createError?.message);
          return { error: "Failed to create membership record" };
        }
        memberData = newMember;
      } else if (memberError) {
        console.error("Error checking member:", memberError?.message);
        return { error: "Error checking membership record" };
      }
      // Insert into 'payments' table
      const { error: paymentError } = await supabase.from("payments").insert({
        profile_id: user.id,
        member_id: memberData.id,
        amount: orderDetails.amount / 100, // Convert from paise back to rupees
        status: "paid",
        order_id:razorpay_order_id, // Store these for reference
        payment_id:razorpay_payment_id,
        method:paymentDetails.method || "razorpay"
      })
  
      if (paymentError) {
        console.error("Supabase payment insert error:", paymentError.message)
        return { error: "Failed to save payment record" }
      }
  
      // Update 'members' table to set membership_type to 'paid'
      const { error: memberUpdateError, data: memberDataUpdated } = await supabase
        .from("members")
        .update({ membership_type: "paid" })
        .eq("profile_id", user.id)
        .select()
        .maybeSingle();

      if (memberUpdateError) {
        console.error("Supabase member update error:", memberUpdateError.message)
        return { error: "Failed to update membership status" }
      }
      
      if (!memberDataUpdated) {
        console.error("Member record not found after payment")
        return { error: "Failed to verify membership update" }
      }
      
      console.log("Member data updated:", memberDataUpdated)

      // 4. All successful
      return { success: true, paymentId: razorpay_payment_id }
  
    } catch (error) {
      console.error("Error verifying payment:", error.message)
      return { error: error.message }
    }
    
  }