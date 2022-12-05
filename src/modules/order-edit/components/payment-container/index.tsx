import Spinner from "@modules/common/icons/spinner"
import { PaymentSession, PaymentProvider } from "@medusajs/medusa"

import { useOrderEditContext } from "@lib/context/order-edit-context"
import clsx from "clsx"
import React from "react"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import PaymentStripe from "../payment-stripe"
import PaymentTest from "../payment-test"
import StripeWrapper from "../payment-stripe/wrapper"

import PaymentButton from "../payment-button"

import { CreditCardIcon } from "../../../layout/components/icons"
import ChevronDown from "@modules/common/icons/chevron-down"

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

  const [provider, setProvider] = React.useState(paymentProviders[0])

  const getSession = (providerId: string, index: number) => {
    if (paymentSessions[index]?.provider_id === providerId) {
      return paymentSessions[index]
    }
    return
  }

  const setSession = (
    index: number,
    key: string,
    provider: PaymentProvider
  ) => {
    return () => {
      managePaymentSessions(
        index,
        key,
        provider.id,
        getSession(provider.id, index)
      )
    }
  }

  let selectedProvider: {
    paymentProvider?: PaymentProvider
    index?: number
  } = {}

  const getPayments = () => {
    return paymentProviders.map((paymentProvider: PaymentProvider) => {
      const key = index + "_" + paymentProvider.id

      const selected = !!getSession(paymentProvider.id, index)

      if (selected) {
        selectedProvider = {
          paymentProvider,
          index,
        }
      }

      return (
        <div
          className={clsx(
            "flex flex-grow flex-col gap-y-4 border border-gray-200 last:border-b-0 min-w-[166px] min-h-[72px] rounded bg-white shadow-sm",
            {
              "method-selected": selected,
            }
          )}
        >
          <div
            style={{ cursor: "pointer" }}
            className={"h-[100%] py-4 px-8"}
            onClick={setSession(index, key, paymentProvider)}
          >
            <div className="h-[100%] flex flex-col justify-between">
              <span>{PaymentInfoMap[paymentProvider.id].icon}</span>
              <h3 className="text-base-semi whitespace-nowrap leading-none text-gray-900">
                {PaymentInfoMap[paymentProvider.id].title}
              </h3>
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <div className="flex gap-1">
      {getPayments()}

      {selectedProvider.paymentProvider && (
        <div className="w-full mt-4">
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              {PaymentInfoMap[selectedProvider.paymentProvider.id].title}{" "}
              selected for payment
              <PaymentElement
                paymentProvider={selectedProvider.paymentProvider}
                paymentSession={getSession(
                  selectedProvider.paymentProvider.id,
                  selectedProvider.index
                )}
              />
            </>
          )}
        </div>
      )}

      <div className="flex-shrink">
        <ProviderDropdown activeProvider="stripe" setProvider={setProvider} />
      </div>
    </div>
  )
}

const PaymentElement = ({
  paymentProvider,
  paymentSession,
}: {
  paymentProvider: PaymentProvider
  paymentSession: PaymentSession
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
      return (
        <div className="pt-8 pr-7">
          <PaymentTest />
          <PaymentButton paymentSession={paymentSession} />
        </div>
      )
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

const ProviderDropdown = ({ activeProvider, setProvider }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className="w-[56px] h-[76px] border border-gray-200 flex justify-center align-center rounded bg-white shadow-sm p-4 cursor-pointer"
        asChild
      >
        <button>
          <ChevronDown size="100%" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white p-4 w-[240px] rounded shadow-lg"
          sideOffset={5}
        >
          <DropdownMenu.RadioGroup
            value={activeProvider}
            onValueChange={setProvider}
          >
            <DropdownMenu.RadioItem
              className="text-grey-90 text-small py-2 cursor-pointer"
              value="stripe"
            >
              Apple
            </DropdownMenu.RadioItem>

            <DropdownMenu.Separator />
            <DropdownMenu.RadioItem
              className="text-grey-90 text-small py-2 cursor-pointer"
              value="stripe"
            >
              Stripe
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>

          <DropdownMenu.Arrow className="DropdownMenuArrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default PaymentContainer
