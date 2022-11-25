import { useOrderEditContext } from "@lib/context/order-edit-context"
import Payment from "@modules/order-edit/components/payment"
import AcceptOrderChanges from "@modules/order-edit/components/accept-changes"
import DeclineOrderChanges from "@modules/order-edit/components/decline-changes"
import OrderEditCompleted from "@modules/order-edit/components/order-edit-completed"
import React from "react"

import Items from "@modules/order-edit/components/items"


const OrderEditForm = () => {
  const {
    orderEdit,
    order,
    paymentCollectionStatus,
    orderEditStatus,
  } = useOrderEditContext()

  if (!orderEdit?.id) {
    return null
  }

  const hasChanges = orderEdit?.changes && orderEdit?.changes?.length
  let updatedProducts = []
  let addedProducts = []
  let removedProducts = []

  if(hasChanges) {
    updatedProducts = orderEdit.changes.filter(change => change.type == "item_update").map(change => change.line_item)
    addedProducts = orderEdit.changes.filter(change => change.type == "item_add").map(change => change.line_item)
    removedProducts = orderEdit.changes.filter(change => change.type == "item_remove").map(change => change.line_item)
  }

  return (
    <div>
      <div className="w-full grid grid-cols-1 gap-y-8">
        <div>
          {
            orderEdit.payment_collection ?
            (
              paymentCollectionStatus !== "authorized" && orderEditStatus === "requested" ?
              <Payment index={0} />
              : <OrderEditCompleted />
            ) :
            ''
          }

          { // Fallback if accepting order edit fails after payment
            paymentCollectionStatus === "authorized" && orderEditStatus === "requested" ?
              <AcceptOrderChanges />
              : ""
          }

          {
            orderEditStatus === "requested" && paymentCollectionStatus !== "authorized" ?
              <DeclineOrderChanges />
              : ""
          }
        </div>

        <h2>Original Order</h2>
        <Items
          items={orderEdit?.items ?? []}
          region={order.region}
        />

        <h2>Order Edit</h2>

        {updatedProducts.length ? <h4>Updated Items</h4> : ''}
        <Items
          items={updatedProducts}
          region={order.region}
        />

        {addedProducts.length ? <h4>Added Items</h4> : ''}
        <Items
          items={addedProducts}
          region={order.region}
        />

        {removedProducts.length ? <h4>Removed Items</h4> : ''}
        <Items
          items={removedProducts}
          region={order.region}
        />

        <pre style={{fontSize: "12px"}}>{JSON.stringify(orderEdit, null, 4)}</pre>
      </div>
    </div>
  )
}

export default OrderEditForm
