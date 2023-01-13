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
    <div className="flex flex-col py-2 gap-y-4">
      {items.map((item) => {
        return (
          <div
            className="flex items-center justify-between gap-x-2"
            key={item.id}
          >
            <div className="flex items-center flex-auto gap-x-4">
              <div className="overflow-hidden rounded-lg">
                <Thumbnail thumbnail={item.thumbnail} size="xxs" />
              </div>

              <div>
                <h3 className="overflow-hidden text-base font-medium overflow-ellipsis whitespace-nowrap text-grey-90">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="flex-none text-grey-50 text-base-regular">
              {item.quantity}x
            </div>
            <div className="flex-none w-32 font-medium text-grey-90">
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
