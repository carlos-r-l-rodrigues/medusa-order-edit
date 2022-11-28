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
    <div>
      {
        orderEdit.difference_due > 0 &&
        <div>
          <h2 className="text-xl-semi">Payment</h2>
          <span>Complete the order edit by providing your payment details</span>
        </div>
      }

      <h3 className="text-large-semi">Summary</h3>

      <div>
      Original Payment: {formatAmount({
        amount: orderEdit.total - orderEdit.difference_due,
        region,
        includeTaxes: false,
      })}
      </div>

      <div>
      New Total: {formatAmount({
        amount: orderEdit.total,
        region,
        includeTaxes: false,
      })}
      </div>

      <div>
      {orderEdit.difference_due < 0 && <span>Amount to be refunded:</span>}
      {orderEdit.difference_due > 0 && <span>Amount Due:</span>}
      </div>

      {formatAmount({
        amount: orderEdit.difference_due * (orderEdit.difference_due < 0 ? -1 : 1),
        region,
        includeTaxes: false,
      })}

      {orderEdit.difference_due > 0 &&
          <>
            <h3 className="text-large-semi">Payment Method</h3>
            <PaymentContainer index={index} isLoading={isLoading} />
          </>
      }
    </div>
  )
}

export default Payment
