"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface PaymentRequest {
  key: string
  txnid: string
  amount: string
  productinfo: string
  firstname: string
  email: string
  phone: string
  surl: string
  furl: string
  hash: string
}

interface PaymentGatewayProps {
  paymentRequest: PaymentRequest
  onSuccess?: () => void
  onFailure?: () => void
}

export function PaymentGateway({ paymentRequest, onSuccess, onFailure }: PaymentGatewayProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Auto-submit the form when component mounts
    if (formRef.current) {
      formRef.current.submit()
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting to Payment Gateway</h2>
        <p className="text-gray-600">Please wait while we redirect you to complete your payment...</p>
      </div>

      {/* Hidden form for payment gateway submission */}
      <form ref={formRef} action="https://test.payu.in/_payment" method="POST" className="hidden">
        <input type="hidden" name="key" value={paymentRequest.key} />
        <input type="hidden" name="txnid" value={paymentRequest.txnid} />
        <input type="hidden" name="amount" value={paymentRequest.amount} />
        <input type="hidden" name="productinfo" value={paymentRequest.productinfo} />
        <input type="hidden" name="firstname" value={paymentRequest.firstname} />
        <input type="hidden" name="email" value={paymentRequest.email} />
        <input type="hidden" name="phone" value={paymentRequest.phone} />
        <input type="hidden" name="surl" value={paymentRequest.surl} />
        <input type="hidden" name="furl" value={paymentRequest.furl} />
        <input type="hidden" name="hash" value={paymentRequest.hash} />
      </form>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Do not refresh or close this page. You will be redirected automatically to the payment
          gateway.
        </p>
      </div>
    </div>
  )
}
