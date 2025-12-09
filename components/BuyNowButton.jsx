"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createOrder, verifyPaymentAndUpdateDatabase } from "@/app/actions/payment"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button1"
import { CheckCircle2, XCircle } from "lucide-react"

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
    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogType, setDialogType] = useState("success") // "success" or "error"
    const [dialogMessage, setDialogMessage] = useState("")
    const [paymentId, setPaymentId] = useState("")
    const router = useRouter()
  
    const openCheckout = async () => {
      setLoading(true)
  
      // 1. Load the Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        setDialogType("error")
        setDialogMessage("Failed to load Razorpay SDK. Please check your connection.")
        setDialogOpen(true)
        setLoading(false)
        return
      }
  
      // 2. Create an order from your server
      const order = await createOrder(amount)
      if (order.error) {
        setDialogType("error")
        setDialogMessage(`Error: ${order.error}`)
        setDialogOpen(true)
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
            setDialogType("error")
            setDialogMessage(`Payment failed: ${verification.error}`)
            setDialogOpen(true)
          } else {
            // 6. Payment successful!
            setDialogType("success")
            setDialogMessage("Payment successful!")
            setPaymentId(verification.paymentId)
            setDialogOpen(true)
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
  
    const handleDialogClose = (open) => {
      if (!open) {
        setDialogOpen(false)
        if (dialogType === "success") {
          // Redirect to private page with full page refresh
          window.location.href = "/private"
        } else if (dialogType === "error" && dialogMessage.includes("Payment failed")) {
          router.push("/payment-failed")
        }
      }
    }

    const handleButtonClick = () => {
      setDialogOpen(false)
      if (dialogType === "success") {
        // Redirect to private page with full page refresh
        window.location.href = "/private"
      } else if (dialogType === "error" && dialogMessage.includes("Payment failed")) {
        router.push("/payment-failed")
      }
    }

    return (
      <>
        <button
          onClick={openCheckout}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : `Pay ₹${amount} Now`}
        </button>

        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <div className="flex items-center gap-3">
                {dialogType === "success" ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600" />
                )}
                <DialogTitle>
                  {dialogType === "success" ? "Payment Successful!" : "Payment Failed"}
                </DialogTitle>
              </div>
              <DialogDescription className="pt-2">
                {dialogMessage}
                {dialogType === "success" && paymentId && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Payment ID: {paymentId}
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleButtonClick} className="w-full">
                {dialogType === "success" ? "Continue" : "Close"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }