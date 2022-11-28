import Spinner from "@modules/common/icons/spinner"
import { PaymentSession, PaymentProvider } from "@medusajs/medusa"

import { useOrderEditContext } from "@lib/context/order-edit-context"
import clsx from "clsx"
import React from "react"

import PaymentStripe from "../payment-stripe"
import PaymentTest from "../payment-test"
import StripeWrapper from "../payment-stripe/wrapper"

import PaymentButton from "../payment-button"

import { CreditCardIcon } from  "../../../layout/components/icons"

type PaymentContainerProps = {
  index: number
  isLoading?: boolean
}

const PaymentInfoMap: Record<string, { title: string; icon?: JSX.Element }> = {
  stripe: {
    title: "Credit card",
    icon: <CreditCardIcon />,
  },
  paypal: {
    title: "PayPal",
    icon: <CreditCardIcon />,
  },
  manual: {
    title: "Test payment",
    icon: <CreditCardIcon />,
  },
  "test-pay": {
    title: "Test payment",
    icon: <CreditCardIcon />,
  },
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  index = 0,
  isLoading = false,
}) => {
  const { order, orderEdit, managePaymentSessions } = useOrderEditContext()

  const region = order.region
  const paymentProviders = region.payment_providers
  const paymentCollection = orderEdit.payment_collection
  const paymentSessions = paymentCollection?.payment_sessions


  const getSession = (providerId: string, index: number) => {
    if(paymentSessions[index]?.provider_id === providerId) {
      return paymentSessions[index]
    }
    return
  }

  const setSession = (index: number, key: string, provider: PaymentProvider) => {
    return () => {
      managePaymentSessions(index, key, provider.id, getSession(provider.id, index))
    }
  }

  let selectedProvider : {
    paymentProvider?: PaymentProvider
    index?: number
  } = { }

  const getPayments = () => {
    return paymentProviders
      .map((paymentProvider: PaymentProvider) => {
          const key = index + "_" + paymentProvider.id;

          const selected = !!getSession(paymentProvider.id, index)

          if(selected) {
            selectedProvider = {
              paymentProvider,
              index,
            }
          }

          return <div
            className={clsx(
              "flex flex-col gap-y-4 border-b border-gray-200 last:border-b-0 pay-method",
              {
                "method-selected": selected,
              }
            )}
          >
            <div
              style={{cursor:"pointer"}}
              className={"grid grid-cols-[12px_1fr] gap-x-4 py-4 px-8"}
              onClick={setSession(index, key, paymentProvider)}
            >
              <div className="flex flex-col text-left">
                <span>{PaymentInfoMap[paymentProvider.id].icon}</span>
                <h3 className="text-base-semi leading-none text-gray-900">
                  {PaymentInfoMap[paymentProvider.id].title}
                </h3>
              </div>
            </div>
          </div>
        })
    }

    return <div>
        <div className="pay-methods-box">
        {getPayments()}
        </div>

        {
          selectedProvider.paymentProvider &&
          <div className="w-full mt-4 payment-box">
            {
            isLoading ? <Spinner /> :
            <>
              {PaymentInfoMap[selectedProvider.paymentProvider.id].title} selected for payment
              <PaymentElement
                paymentProvider={selectedProvider.paymentProvider}
                paymentSession={getSession(selectedProvider.paymentProvider.id, selectedProvider.index)}
              />
            </>
            }
          </div>
        }
    </div>
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
