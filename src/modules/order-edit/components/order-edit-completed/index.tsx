import { useOrderEditContext } from "@lib/context/order-edit-context"
import { formatAmount } from "medusa-react"

const OrderEditCompleted = () => {
  const { order, orderEdit, paymentCollectionStatus, orderEditStatus } =
    useOrderEditContext()

  return (
    <div className="grid h-full place-items-center">
      <div className="w-64 text-center justify-items-center">
        <div className="flex justify-center mb-4">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.5 24C4.5 13.23 13.23 4.5 24 4.5C34.77 4.5 43.5 13.23 43.5 24C43.5 34.77 34.77 43.5 24 43.5C13.23 43.5 4.5 34.77 4.5 24ZM31.22 20.372C31.34 20.2121 31.4268 20.0298 31.4754 19.8359C31.5239 19.642 31.5332 19.4403 31.5027 19.2427C31.4722 19.0451 31.4025 18.8556 31.2977 18.6854C31.1929 18.5151 31.0552 18.3676 30.8925 18.2513C30.7299 18.1351 30.5456 18.0525 30.3506 18.0085C30.1556 17.9644 29.9538 17.9598 29.757 17.9949C29.5601 18.03 29.3723 18.1041 29.2046 18.2128C29.0368 18.3215 28.8924 18.4627 28.78 18.628L22.308 27.688L19.06 24.44C18.7757 24.175 18.3996 24.0308 18.011 24.0376C17.6224 24.0445 17.2516 24.2019 16.9768 24.4768C16.7019 24.7516 16.5445 25.1224 16.5376 25.511C16.5308 25.8996 16.675 26.2757 16.94 26.56L21.44 31.06C21.594 31.2139 21.7796 31.3324 21.984 31.4073C22.1884 31.4822 22.4066 31.5118 22.6235 31.4939C22.8405 31.476 23.0509 31.4111 23.2403 31.3037C23.4296 31.1963 23.5933 31.049 23.72 30.872L31.22 20.372Z"
              fill="#7C3AED"
            />
          </svg>
        </div>

        {orderEdit.payment_collection &&
          paymentCollectionStatus === "authorized" && (
            <div>
              <h2 className="mb-4 text-base text-grey-40">
                Payment Successful
              </h2>
              <div className="mb-4 text-2xl font-bold">
                {formatAmount({
                  amount:
                    orderEdit?.difference_due ||
                    orderEdit?.payment_collection?.authorized_amount,
                  region: order.region,
                  includeTaxes: false,
                })}
              </div>
              <div className="text-base text-grey-40">
                The payment will appear on your statement as "Branded Store
                order edit”.
              </div>
            </div>
          )}

        {orderEdit.payment_collection == null &&
          orderEditStatus === "confirmed" && (
            <div>
              <h2 className="mb-4 text-base text-grey-40">Payment Refunded</h2>
              {orderEdit?.difference_due != 0 && (
                <div className="mb-4 text-2xl font-bold">
                  {formatAmount({
                    amount: orderEdit.difference_due * -1,
                    region: order.region,
                    includeTaxes: false,
                  })}
                </div>
              )}
              <div className="text-base text-grey-40">
                The payment will appear on your statement as "Branded Store
                order edit”.
              </div>
            </div>
          )}

        <div className="">
          {orderEditStatus === "declined" && (
            <div>
              <p className="text-base text-grey-40">Order Edit was declined</p>
              <p className="text-base text-grey-40">
                "{orderEdit.declined_reason}"
              </p>
            </div>
          )}
        </div>
      </div>
      <div></div>
      <div></div>
    </div>
  )
}

export default OrderEditCompleted
