import { OrderEditProvider } from "@lib/context/order-edit-context"

import OrderEditForm from "./order-edit-form"

const OrderEditTemplate = ({ orderEdit }) => {
  return (
    <OrderEditProvider orderEdit={orderEdit}>
      <div className="bg-gray-100">
        <div className="flex min-h-screen">
          <OrderEditForm />
        </div>
      </div>
    </OrderEditProvider>
  )
}

export default OrderEditTemplate
