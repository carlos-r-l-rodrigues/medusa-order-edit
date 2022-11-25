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
    <div className="p-10 border-b border-gray-200 gap-y-4 flex flex-col">
      {items.map((item) => {
            return (
              <div className="grid grid-cols-[122px_1fr] gap-x-4" key={item.id}>
                <div className="w-[122px]">
                  <Thumbnail thumbnail={item.thumbnail} size="full" />
                </div>
                <div className="flex flex-col justify-between flex-1">
                  <div className="flex flex-col flex-1 text-small-regular">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base-regular overflow-ellipsis overflow-hidden whitespace-nowrap mr-4">
                            <a>{item.quantity}x {item.title}</a>
                        </h3>
                      </div>
                      <div className="flex justify-end">
                        <LineItemPrice
                          quantity={item.quantity}
                          region={region}
                          item={item}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
    </div>
  )
}

export default Items
