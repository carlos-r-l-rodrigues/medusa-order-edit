import { PaymentSession } from "@medusajs/medusa"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import React from "react"

type PaymentProps = {
  paymentSession?: PaymentSession | null
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "")

const StripeWrapper: React.FC<PaymentProps> = ({
  paymentSession,
  children,
}) => {
  const options: StripeElementsOptions = {
    clientSecret: paymentSession?.data?.client_secret! as string | undefined,
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}

export default StripeWrapper
