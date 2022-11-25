import { OrderEditProvider } from "@lib/context/order-edit-context"
import OrderEditForm from "./order-edit-form"

const OrderEditTemplate = ({ orderEdit }) => {
  return (
    <OrderEditProvider orderEdit={orderEdit} >
      <div className="bg-gray-100 relative small:min-h-screen">
        <div className="relative">
          <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] gap-y-8 content-container gap-x-8 py-12">
            <OrderEditForm />
          </div>
        </div>
      </div>
    </OrderEditProvider>
  )
}

export default OrderEditTemplate
