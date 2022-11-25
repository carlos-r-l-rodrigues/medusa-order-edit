import Spinner from "@modules/common/icons/spinner"
import { PaymentSession, PaymentProvider } from "@medusajs/medusa"
import Radio from "@modules/common/components/radio"
import clsx from "clsx"
import React from "react"

import PaymentStripe from "../payment-stripe"
import PaymentTest from "../payment-test"
import StripeWrapper from "../payment-stripe/wrapper"

import PaymentButton from "../payment-button"

type PaymentContainerProps = {
  paymentSession?: PaymentSession,
  paymentProvider: PaymentProvider
  selected?: boolean
  setSelected: () => void
  disabled?: boolean
  isLoading?: boolean
}

const PaymentInfoMap: Record<string, { title: string; description: string }> = {
  stripe: {
    title: "Credit card",
    description: "Secure payment with credit card",
  },
  paypal: {
    title: "PayPal",
    description: "Secure payment with PayPal",
  },
  manual: {
    title: "Test payment",
    description: "Test payment using medusa-payment-manual",
  },
  "test-pay": {
    title: "Test payment",
    description: "Test payment using medusa-payment-manual",
  },
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProvider,
  paymentSession,
  selected,
  setSelected,
  isLoading = false,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col gap-y-4 border-b border-gray-200 last:border-b-0",
        {
          "bg-gray-50": selected,
        }
      )}
    >
      <div
        style={{cursor:"pointer"}}
        className={"grid grid-cols-[12px_1fr] gap-x-4 py-4 px-8"}
        onClick={setSelected}
      >
        <Radio checked={!!selected} />
        <div className="flex flex-col text-left">
          <h3 className="text-base-semi leading-none text-gray-900">
            {PaymentInfoMap[paymentProvider.id].title}
          </h3>
          <span className="text-gray-700 text-small-regular mt-2">
            {PaymentInfoMap[paymentProvider.id].description}
          </span>
          {selected && (
            <div className="w-full mt-4">
              {isLoading ? <Spinner /> : <PaymentElement paymentProvider={paymentProvider} paymentSession={paymentSession} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PaymentElement = ({
  paymentProvider,
  paymentSession,
}: {
  paymentProvider: PaymentProvider,
  paymentSession: PaymentSession,
}) => {
  switch (paymentProvider.id) {
    case "stripe":
      return (
        <div className="pt-8 pr-7">
          <StripeWrapper>
            <PaymentStripe />
            <PaymentButton paymentSession={paymentSession} />
          </StripeWrapper>
        </div>
      )
    case "manual":
      // We only display the test payment form if we are in a development environment
      return (
        <div className="pt-8 pr-7">
          <PaymentTest />
          <PaymentButton paymentSession={paymentSession} />
        </div>
      )
    case "test-pay":
      <div className="pt-8 pr-7">
          <PaymentTest />
          <PaymentButton paymentSession={paymentSession} />
        </div>
    case "paypal":
      return (
        <div className="pt-8 pr-7">
          <PaymentButton paymentSession={paymentSession} />
        </div>
      )
    default:
      return null
  }
}


export default PaymentContainer
