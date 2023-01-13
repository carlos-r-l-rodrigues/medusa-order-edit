import { formatAmount } from "medusa-react"

import { LineItem, Region } from "@medusajs/medusa"

import Thumbnail, { Thumbnails } from "@modules/products/components/thumbnail"

type ItemsSummaryProps = {
  items: LineItem[]
  region: Region
  subtotal: number
}

const ItemsSummary = ({ items, region, subtotal }: ItemsSummaryProps) => {
  let summary = ""

  switch (items.length) {
    case 0:
      return null
    case 1:
      const item = items[0]
      summary = `${item.quantity}x ${item.title}`
      break
    case 2:
      summary = `${items[0].quantity}x ${items[0].title} & ${items[1].quantity}x ${items[1].title}`
      break
    default:
      summary = `${items[0].quantity}x ${items[0].title}, ${
        items[1].quantity
      }x ${items[1].title} + ${items.length - 2} more`
  }

  return (
    <div className="flex flex-col py-2 gap-y-4">
      <div className="flex justify-between gap-x-2">
        <div className="flex items-center flex-auto gap-x-4">
          <div className="relative overflow-hidden rounded-lg">
            <Thumbnails
              thumbnails={items.map((item) => item.thumbnail)}
              size="xxs"
            />
          </div>

          <h3
            title={summary}
            className="overflow-ellipsis overflow-hidden whitespace-nowrap font-medium text-base text-grey-90 max-w-[288px]"
          >
            {summary}
          </h3>
        </div>

        <div className="flex items-center justify-end flex-none w-32 font-medium text-grey-90">
          <span className="text-right text-gray-700 text-base-regular">
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
