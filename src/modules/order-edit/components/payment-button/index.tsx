import { PaymentSession, PaymentCollection } from "@medusajs/medusa"
import Button from "@modules/common/components/button"
import Spinner from "@modules/common/icons/spinner"
import { OnApproveActions, OnApproveData } from "@paypal/paypal-js"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { useOrderEditContext } from "@lib/context/order-edit-context"
import React, { useEffect, useState } from "react"
import { formatAmount } from "medusa-react"


type PaymentButtonProps = {
  paymentSession?: PaymentSession | null
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ paymentSession }) => {
  const [notReady, setNotReady] = useState(true)
  const { orderEdit, order } = useOrderEditContext()

  const amount = formatAmount({
    amount: orderEdit.difference_due,
    region: order.region,
    includeTaxes: false,
  })

  useEffect(() => {
    setNotReady(true)

    if (!orderEdit) {
      return
    }

    setNotReady(false)
  }, [orderEdit])

  if(!paymentSession) {
    return <></>
  }

  const provider_id = paymentSession.provider_id
  switch (provider_id) {
    case "stripe":
      return (
        <StripePaymentButton paymentSession={paymentSession} notReady={notReady} amount={amount} />
      )
    case "manual":
      return <ManualTestPaymentButton paymentSession={paymentSession} notReady={notReady} amount={amount} />
    case "test-pay":
      return <ManualTestPaymentButton paymentSession={paymentSession} notReady={notReady} amount={amount} />
    case "paypal":
      return (
        <PayPalPaymentButton notReady={notReady} paymentSession={paymentSession} amount={amount} />
      )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const StripePaymentButton = ({
  paymentSession,
  notReady,
  amount,
}: {
  paymentSession: PaymentSession
  notReady: boolean
  amount: string
}) => {
  const [disabled, setDisabled] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )

  const { orderEdit, onPaymentCompleted } = useOrderEditContext()

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("cardNumber")

  useEffect(() => {
    if (!stripe || !elements) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [stripe, elements])

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !orderEdit) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(paymentSession.data.client_secret as string, {
        payment_method: {
          card: card,
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted(paymentSession)
          }

          setErrorMessage(error.message)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted(paymentSession)
        }

        return
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <>
      <Button
        disabled={submitting || disabled || notReady}
        onClick={handlePayment}
      >
        {submitting ? <Spinner /> : `Pay ${amount}`}
      </Button>
      {errorMessage && (
        <div className="text-red-500 text-small-regular mt-2">
          {errorMessage}
        </div>
      )}
    </>
  )
}

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""

const PayPalPaymentButton = ({
  paymentSession,
  notReady,
  amount,
}: {
  paymentSession: PaymentSession
  notReady: boolean
  amount: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )

  const { order, onPaymentCompleted } = useOrderEditContext()

  const handlePayment = async (
    _data: OnApproveData,
    actions: OnApproveActions
  ) => {
    actions?.order
      ?.authorize()
      .then((authorization) => {
        if (authorization.status !== "COMPLETED") {
          setErrorMessage(`An error occurred, status: ${authorization.status}`)
          return
        }
        onPaymentCompleted(paymentSession)
      })
      .catch(() => {
        setErrorMessage(`An unknown error occurred, please try again.`)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }
  return (
    <PayPalScriptProvider
      options={{
        "client-id": PAYPAL_CLIENT_ID,
        currency: order.region.currency_code.toUpperCase(),
        intent: "authorize",
      }}
    >
      {errorMessage && (
        <span className="text-rose-500 mt-4">{errorMessage}</span>
      )}
      <PayPalButtons
        style={{ layout: "horizontal" }}
        createOrder={async () => paymentSession.data.id as string}
        onApprove={handlePayment}
        disabled={notReady || submitting}
      />
    </PayPalScriptProvider>
  )
}

const ManualTestPaymentButton = ({
  paymentSession,
  notReady,
  amount,
}: {
  paymentSession: PaymentSession
  notReady: boolean
  amount: string
}) => {
  const [submitting, setSubmitting] = useState(false)

  const { onPaymentCompleted } = useOrderEditContext()

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted(paymentSession)

    setSubmitting(false)
  }

  return (
    <Button disabled={submitting || notReady} onClick={handlePayment}>
      {submitting ? <Spinner /> : `Pay ${amount}`}
    </Button>
  )
}

export default PaymentButton
