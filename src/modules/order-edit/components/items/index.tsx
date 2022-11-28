import { LineItem, Region } from "@medusajs/medusa"
import LineItemPrice from "@modules/common/components/line-item-price"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemsProps = {
  items: LineItem[]
  region: Region
}

const Items = ({ items, region }: ItemsProps) => {
  if (!items.length) {
    return <></>
  }

  return (
    <div className="py-2 gap-y-4 flex flex-col">
      {items.map((item) => {
        return (
          <div className="flex justify-between gap-x-2" key={item.id}>
            <div className="flex gap-x-4 flex-auto">
              <div className="rounded overflow-hidden">
                <Thumbnail thumbnail={item.thumbnail} size="xxs" />
              </div>

              <div>
                <h3 className="overflow-ellipsis overflow-hidden whitespace-nowrap font-medium text-base text-grey-90">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="text-grey-50 text-base-regular flex-none">
              {item.quantity}x
            </div>
            <div className="text-grey-90 font-medium flex-none w-32">
              <LineItemPrice
                quantity={item.quantity}
                region={region}
                item={item}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Items
