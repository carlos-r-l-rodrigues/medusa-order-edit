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
import CheckCircleIcon from "@modules/common/icons/check"
import CheckIcon from "@modules/common/icons/check"

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
    title: "Cash",
    icon: <CreditCardIcon />,
  },
  "test-pay": {
    title: "Cash",
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
    managePaymentSessions(
      index,
      key,
      provider.id,
      getSession(provider.id, index)
    )
  }

  let selectedProvider: {
    paymentProvider?: PaymentProvider
    index?: number
  } = {}

  const onProviderSelect = (index: number, provider: PaymentProvider) => {
    const key = index + "_" + provider.id
    setSession(index, key, provider)
  }

  const getPayments = () => {
    return paymentProviders
      .slice(0, 2)
      .map((paymentProvider: PaymentProvider) => {
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
              "flex flex-grow flex-col border border-gray-200 min-w-[166px] min-h-[72px] rounded-rounded bg-white",
              {
                "method-selected": selected,
              }
            )}
          >
            <div
              style={{ cursor: "pointer" }}
              className={"h-[100%] p-4"}
              onClick={() => onProviderSelect(index, paymentProvider)}
            >
              <div className="h-[100%] flex flex-col justify-between">
                <span>{PaymentInfoMap[paymentProvider.id].icon}</span>
                <h3 className="leading-none text-gray-900 text-base-semi whitespace-nowrap">
                  {PaymentInfoMap[paymentProvider.id].title}
                </h3>
              </div>
            </div>
          </div>
        )
      })
  }

  return (
    <div>
      <div
        className={clsx(`grid gap-2`, {
          "grid-cols-[3fr_3fr_1fr]": paymentProviders.length > 2,
          "grid-colrs-[1fr_1fr]": paymentProviders.length <= 2,
        })}
      >
        {getPayments()}
        {paymentProviders.length > 2 && (
          <ProviderDropdown
            dropdownProviders={paymentProviders.slice(2)}
            setProvider={onProviderSelect}
            getSession={getSession}
            index={index}
          />
        )}
      </div>
      {selectedProvider.paymentProvider && (
        <div className="w-full mt-4">
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <p className="text-sm text-gray-400">
                {PaymentInfoMap[selectedProvider.paymentProvider.id].title}{" "}
                selected for check out.
              </p>
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
        <div className="pt-8">
          <StripeWrapper>
            <PaymentStripe />
            <PaymentButton paymentSession={paymentSession} />
          </StripeWrapper>
        </div>
      )
    case "manual":
      // We only display the test payment form if we are in a development environment
      return (
        <div className="pt-8">
          <PaymentTest />
          <PaymentButton paymentSession={paymentSession} />
        </div>
      )
    case "test-pay":
      return (
        <div className="pt-8">
          <PaymentTest />
          <PaymentButton paymentSession={paymentSession} />
        </div>
      )
    case "paypal":
      return (
        <div className="pt-8">
          <PaymentButton paymentSession={paymentSession} />
        </div>
      )
    default:
      return null
  }
}

const ProviderDropdown = ({
  dropdownProviders,
  setProvider,
  getSession,
  index,
}: {
  dropdownProviders: PaymentProvider[]
  setProvider: (index: number, provider: PaymentProvider) => void
  getSession: (providerId: string, index: number) => PaymentSession | undefined
  index: number
}) => {
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
          className="bg-white py-2 w-[240px] rounded shadow-lg"
          sideOffset={5}
        >
          <DropdownMenu.RadioGroup
            onValueChange={(provider) => {
              const selectedProvider = dropdownProviders.find(
                (dropdownProvider) => dropdownProvider.id === provider
              )
              if (selectedProvider) setProvider(index, selectedProvider)
            }}
          >
            {dropdownProviders.map((dropdownProvider) => {
              const selected = !!getSession(dropdownProvider.id, index)

              return (
                <DropdownMenu.RadioItem
                  className="px-4 py-2 cursor-pointer text-grey-90 text-small hover:bg-gray-50"
                  value={dropdownProvider.id}
                >
                  <div className="flex items-center">
                    <span className="mr-4">
                      {PaymentInfoMap[dropdownProvider.id].icon}
                    </span>
                    <span className={clsx({ "font-semibold": selected })}>
                      {PaymentInfoMap[dropdownProvider.id].title}
                    </span>
                    {selected && (
                      <span className="ml-auto">
                        <CheckIcon size={24} />
                      </span>
                    )}
                  </div>
                </DropdownMenu.RadioItem>
              )
            })}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default PaymentContainer
