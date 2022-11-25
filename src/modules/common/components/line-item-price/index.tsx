import { Region, LineItem } from "@medusajs/medusa"
import clsx from "clsx"
import { formatAmount } from "medusa-react"


type LineItemPriceProps = {
  item: LineItem
  region: Region
  quantity: number
  style?: "default" | "tight"
}

const LineItemPrice = ({
  item,
  region,
  quantity,
}: LineItemPriceProps) => {
  return (
    <div className="flex flex-col text-gray-700 text-right">
      <span
        className={clsx("text-base-regular")}
      >
        {formatAmount({
          amount: item.unit_price * quantity,
          region: region,
          includeTaxes: false,
        })}
      </span>

    </div>
  )
}

export default LineItemPrice
