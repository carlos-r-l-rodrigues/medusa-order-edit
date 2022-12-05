import { useOrderEditContext } from "@lib/context/order-edit-context"
import { formatAmount } from "medusa-react"

import PaymentContainer from "../payment-container"

interface PaymentProps {
  index: number
}

const Payment = ({ index }: PaymentProps) => {
  const { order, orderEdit, isLoading } = useOrderEditContext()

  const region = order.region

  return (
    <div className="w-[480px]">
      {orderEdit.difference_due > 0 && (
        <div>
          <h1 className="text-xl-semi text-grey-90">Payment</h1>
          <p className="text-grey-40 text-sm">
            Complete the order edit by providing your payment details
          </p>
        </div>
      )}

      <h2 className="mt-6 mb-2 text-grey-90 text-sm font-semibold">Summary</h2>

      <div className="mb-2 text-grey-40 text-sm flex justify-between">
        Original Payment:{" "}
        <span className="text-grey-90">
          {formatAmount({
            amount: orderEdit.total - orderEdit.difference_due,
            region,
            includeTaxes: false,
          })}{" "}
        </span>
      </div>

      <div className="mb-2 text-grey-40 text-sm flex justify-between">
        New Total:{" "}
        <span className="text-grey-90">
          {formatAmount({
            amount: orderEdit.total,
            region,
            includeTaxes: false,
          })}
        </span>
      </div>

      <div className="mb-2 text-grey-40 text-sm flex justify-between">
        {orderEdit.difference_due < 0 && <span>Amount to be refunded:</span>}
        {orderEdit.difference_due > 0 && <span>Amount Due:</span>}
        <span className="text-grey-90">
          {formatAmount({
            amount:
              orderEdit.difference_due *
              (orderEdit.difference_due < 0 ? -1 : 1),
            region,
            includeTaxes: false,
          })}
        </span>
      </div>

      {orderEdit.difference_due > 0 && (
        <>
          <h2 className="mt-6 mb-2 text-grey-90 text-sm font-semibold">
            Payment Method
          </h2>
          <PaymentContainer index={index} isLoading={isLoading} />
        </>
      )}
    </div>
  )
}

export default Payment
