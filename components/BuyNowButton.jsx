"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createOrder, verifyPaymentAndUpdateDatabase } from "@/app/actions/payment"

// This function loads the Razorpay script
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  export default function BuyNowButton({ amount, userDetails }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
  
    const openCheckout = async () => {
      setLoading(true)
  
      // 1. Load the Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        alert("Failed to load Razorpay SDK. Please check your connection.")
        setLoading(False)
        return
      }
  
      // 2. Create an order from your server
      const order = await createOrder(amount)
      if (order.error) {
        alert(`Error: ${order.error}`)
        setLoading(false)
        return
      }
  
      // 3. Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Your Company Name",
        description: "Membership Payment",
        order_id: order.id,
        
        // 4. This function runs after payment
        handler: async function (response) {
          // 5. Send verification data to your server
          const verification = await verifyPaymentAndUpdateDatabase({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
  
          if (verification.error) {
            alert(`Payment failed: ${verification.error}`)
            router.push("/payment-failed")
          } else {
            // 6. Payment successful!
            alert(`Payment successful! ID: ${verification.paymentId}`)
            
            router.push("/private") // Redirect to a success page
          }
        },
        prefill: {
          name: userDetails.name || "",
          email: userDetails.email || "",
          contact: userDetails.contact || "",
        },
        theme: {
          color: "#3399cc",
        },
      }
  
      // 7. Open the Razorpay checkout modal
      const rzp = new window.Razorpay(options)
      rzp.open()
      setLoading(false)
    }
  
    return (
      <button
        onClick={openCheckout}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay ₹${amount} Now`}
      </button>
    )
  }