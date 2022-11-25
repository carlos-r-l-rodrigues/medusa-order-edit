import { useOrderEditContext } from "@lib/context/order-edit-context"

const OrderEditCompleted = () => {
  const { orderEdit, paymentCollectionStatus, orderEditStatus } = useOrderEditContext()

  return (
    <div className="w-full">
      <div className="flex items-center gap-x-2 bg-yellow-100 w-full p-2">
        {
          orderEdit.payment_collection && paymentCollectionStatus === "authorized" ?
            "Payment Successful" :
            ""
        }
        <br />

        {
          orderEditStatus === "confirmed" ?
          "Order Edit Completed" :
          (
            orderEditStatus === "declined" ?
            `Order Edit was declined: ${orderEdit.declined_reason}` :
            ""
          )
        }
      </div>
    </div>
  )
}

export default OrderEditCompleted
