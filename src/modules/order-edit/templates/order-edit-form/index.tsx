import React from "react"

import { formatAmount } from "medusa-react"

import { useOrderEditContext } from "@lib/context/order-edit-context"
import Payment from "@modules/order-edit/components/payment"
import AcceptOrderChanges from "@modules/order-edit/components/accept-changes"
import DeclineOrderChanges from "@modules/order-edit/components/decline-changes"
import OrderEditCompleted from "@modules/order-edit/components/order-edit-completed"

import Items from "@modules/order-edit/components/items"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import ItemsSummary from "@modules/order-edit/components/items-summary"

const SectionDivider = () => {
  return (
    <div className="relative h-[20px] flex justify-center items-center my-5">
      <div className="border-b absolute top-[11px] w-[100%]" />
      <div className="text-grey-40 font-xl p-4 bg-white w-[32px] h-[32px] z-50 flex justify-center items-center">
        +
      </div>
    </div>
  )
}

const OrderEditForm = () => {
  const { orderEdit, order, paymentCollectionStatus, orderEditStatus } =
    useOrderEditContext()

  if (!orderEdit?.id) {
    return null
  }

  const hasChanges = orderEdit?.changes && orderEdit?.changes?.length
  let updatedProducts = []
  let addedProducts = []
  let removedProducts = []

  if (hasChanges) {
    updatedProducts = orderEdit.changes
      .filter((change) => change.type == "item_update")
      .map((change) => change.line_item)
    addedProducts = orderEdit.changes
      .filter((change) => change.type == "item_add")
      .map((change) => change.line_item)
    removedProducts = orderEdit.changes
      .filter((change) => change.type == "item_remove")
      .map((change) => change.original_line_item)
  }

  let buttonText
  if (orderEdit.difference_due < 0) {
    const refundValue = formatAmount({
      amount: orderEdit.difference_due * -1,
      region: order.region,
      includeTaxes: false,
    })
    buttonText = `Confirm Refund of ${refundValue}`
  }

  return (
    <>
      <div className="w-full bg-white content-container flex justify-center pt-16 pb-8">
        <div className="w-[480px]">
          <h1 className="text-xl-semi text-grey-90">Order edit detals</h1>
          <p className="text-grey-40 text-sm">
            Overview of the changes made in the order edit
          </p>
          <h2 className="mt-6 mb-2 text-grey-90 text-sm font-semibold">
            Original Order
          </h2>
          <ItemsSummary
            // TODO: check subtotal if draft order
            subtotal={order.subtotal}
            items={order?.items ?? []}
            region={order.region}
          />

          <SectionDivider />

          <h2 className="text-grey-90 text-sm font-semibold mb-2">
            Order edit
          </h2>
          {addedProducts.length ? (
            <h4 className="text-small font-semibold text-grey-50">Added</h4>
          ) : (
            ""
          )}
          <Items items={addedProducts} region={order.region} />
          {updatedProducts.length ? (
            <h4 className="text-small font-semibold text-grey-50 mt-6">
              Updated
            </h4>
          ) : (
            ""
          )}
          <Items items={updatedProducts} region={order.region} />
          {removedProducts.length ? (
            <h4 className="text-small font-semibold text-grey-50 mt-6">
              Removed
            </h4>
          ) : (
            ""
          )}
          <Items items={removedProducts} region={order.region} />
        </div>
      </div>

      <div className="w-full bg-gray-100 content-container pt-16 pb-8 mb-2">
        <div className="flex h-full justify-center ">
          <div>
            {
              (orderEditStatus === "confirmed" || orderEditStatus === "declined") &&
                <OrderEditCompleted />
            }

            {
              orderEdit.payment_collection &&
              paymentCollectionStatus !== "authorized" &&
              orderEditStatus === "requested" &&
              <Payment index={0} />
            }

            {
              // If refund or if accepting order edit fails after payment
              (orderEditStatus === "requested" && (
                orderEdit.difference_due < 0 ||
                paymentCollectionStatus === "authorized"
                )
              ) && (
                <AcceptOrderChanges text={buttonText} />
              )
            }

            {orderEditStatus === "requested" &&
            paymentCollectionStatus !== "authorized" ? (
              <DeclineOrderChanges />
            ) : (
              ""
            )}
          </div>
        </div>
        <MedusaCTA />
      </div>
    </>
  )
}

export default OrderEditForm
