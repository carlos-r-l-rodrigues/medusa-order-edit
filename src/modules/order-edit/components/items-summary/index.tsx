import { LineItem, Region } from "@medusajs/medusa"
import LineItemPrice from "@modules/common/components/line-item-price"
import Thumbnail from "@modules/products/components/thumbnail"
import { formatAmount } from "medusa-react"

type ItemsSummaryProps = {
  items: LineItem[]
  region: Region
  subtotal: number
}

const ItemsSummary = ({ items, region, subtotal }: ItemsSummaryProps) => {
  if (!items.length) {
    return null
  }

  let summary = ""

  if (items.length === 1) {
    const item = items[0]
    summary = `${item.quantity}x ${item.title}`
  }

  if (items.length === 2) {
    summary = `${items[0].quantity}x ${items[0].title} & ${items[1].quantity}x ${items[1].title}`
  } else {
    summary = `${items[0].quantity}x ${items[0].title}, ${items[1].quantity}x ${
      items[1].title
    } + ${items.length - 2} more`
  }

  return (
    <div className="py-2 gap-y-4 flex flex-col">
      <div className="flex justify-between gap-x-2">
        <div className="flex items-center gap-x-4 flex-auto">
          <div className="rounded overflow-hidden">
            <Thumbnail thumbnail={items[0].thumbnail} size="xxs" />
          </div>

          <h3
            title={summary}
            className="overflow-ellipsis overflow-hidden whitespace-nowrap font-medium text-base text-grey-90 max-w-[288px]"
          >
            {summary}
          </h3>
        </div>

        <div className="flex items-center justify-end text-grey-90 font-medium flex-none w-32">
          <span className="text-base-regular text-gray-700 text-right">
            {formatAmount({
              amount: subtotal,
              region: region,
              includeTaxes: false,
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ItemsSummary
