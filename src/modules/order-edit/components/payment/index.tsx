import { useOrderEditContext } from "@lib/context/order-edit-context"
import { PaymentProvider } from "@medusajs/medusa"
import { formatAmount } from "medusa-react"

import PaymentContainer from "../payment-container"

interface PaymentProps {
  index: number
}

const Payment = ({ index }: PaymentProps) => {

  const { order, orderEdit, managePaymentSessions, isLoading } = useOrderEditContext()

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

  return (
    <div>
      Original Payment: {formatAmount({
        amount: orderEdit.total - orderEdit.difference_due,
        region,
        includeTaxes: false,
      })} <br />

      New Total: {formatAmount({
        amount: orderEdit.total,
        region,
        includeTaxes: false,
      })} <br />

      Amount Due: {formatAmount({
        amount: orderEdit.difference_due,
        region,
        includeTaxes: false,
      })} <br />

      {(
        paymentProviders
          .map((provider: PaymentProvider) => {
            const key = index + "_" + provider.id;
            return (
              <PaymentContainer
                paymentSession={getSession(provider.id, index)}
                paymentProvider={provider}
                setSelected={setSession(index, key, provider)}
                selected={!!getSession(provider.id, index)}
                key={key}
                isLoading={isLoading}
              />
            )
          })
      )}
    </div>
  )
}

export default Payment
