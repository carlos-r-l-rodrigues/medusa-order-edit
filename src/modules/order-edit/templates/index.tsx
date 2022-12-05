import { OrderEditProvider } from "@lib/context/order-edit-context"

import OrderEditForm from "./order-edit-form"

const OrderEditTemplate = ({ orderEdit }) => {
  return (
    <OrderEditProvider orderEdit={orderEdit}>
      <div className="flex min-h-screen">
        <OrderEditForm />
      </div>
    </OrderEditProvider>
  )
}

export default OrderEditTemplate
