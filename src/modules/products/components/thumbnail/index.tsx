import { Image as MedusaImage } from "@medusajs/medusa"
import PlaceholderImage from "@modules/common/icons/placeholder-image"
import clsx from "clsx"
import Image from "next/image"
import React from "react"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: MedusaImage[] | null
  size?: "xxs" | "small" | "medium" | "large" | "full"
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <div
      className={clsx("relative aspect-[29/34]", {
        "w-[36px]": size === "xxs",
        "w-[180px]": size === "small",
        "w-[290px]": size === "medium",
        "w-[440px]": size === "large",
        "w-full": size === "full",
      })}
    >
      <ImageOrPlaceholder image={initialImage} size={size} />
    </div>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
}: Pick<ThumbnailProps, "size"> & { image?: string }) => {
  return image ? (
    <Image
      src={image}
      alt="Thumbnail"
      layout="fill"
      objectFit="cover"
      objectPosition="center"
      className="absolute inset-0"
      draggable={false}
    />
  ) : (
    <div className="w-full h-full absolute inset-0 bg-gray-100 flex items-center justify-center">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  )
}

export const Thumbnails = ({ thumbnails }: { thumbnails: string[] }) => {
  return (
    <div className="relative w-[40px] h-[40px]">
      {thumbnails.slice(0, 3).map((t, i) => (
        <div
          className="absolute aspect-[30/40] w-[32px] rounded-lg overflow-hidden border-2 border-white"
          style={{ left: i * 8 }}
        >
          <ImageOrPlaceholder image={t} size="xxs" />
        </div>
      ))}
    </div>
  )
}

export default Thumbnail
