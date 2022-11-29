import { medusaClient } from "@lib/config"
import { IS_BROWSER } from "@lib/constants"
import Layout from "@modules/layout/templates"
import OrderEditTemplate from "@modules/order-edit/templates"
import SkeletonOrderItems from "@modules/skeletons/components/skeleton-order-items"
import { GetStaticProps, GetStaticPaths } from "next"
import { useRouter } from "next/router"

import { ReactElement } from "react"
import { dehydrate, QueryClient, useQuery } from "react-query"
import { NextPageWithLayout, PrefetchedPageProps } from "types/global"

const fetchOrderEdit = async (id: string): Promise<any> => {
  const expand = [
    "changes",
    "changes.line_item",
    "changes.original_line_item",
    "items",
    "items.adjustments",
    "items.tax_lines",
    "payment_collection",
    "payment_collection.payment_sessions",
    "order",
    "order.region",
    "order.items",
  ]

  return await medusaClient.orderEdits
    .retrieve(id + "?expand=" + expand.join(","))
    .then(async ({ order_edit }) => {
      return order_edit
    })
}

const OrderEditPage: NextPageWithLayout<PrefetchedPageProps> = ({
  notFound,
}) => {
  const { query, isFallback, replace } = useRouter()

  const id = query.id + ""

  const {
    data: orderEdit,
    isError,
    isSuccess,
    isLoading,
  } = useQuery(["get_order_edit", id], () => fetchOrderEdit(id))

  if (notFound) {
    if (IS_BROWSER) {
      replace("/404")
    }

    return <SkeletonOrderItems />
  }

  if (isFallback || isLoading || !orderEdit) {
    return <SkeletonOrderItems />
  }

  if (isError) {
    replace("/404")
  }

  if (isSuccess) {
    return <OrderEditTemplate orderEdit={orderEdit} />
  }

  return <></>
}

OrderEditPage.getLayout = (page: ReactElement) => {
  return (
    <Layout hideHeader hideFooter>
      {page}
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient()
  const id = context.params?.id as string

  await queryClient.prefetchQuery(["get_order_edit", id], () =>
    fetchOrderEdit(id)
  )

  const queryData = await queryClient.getQueryData([`get_order_edit`, id])

  if (!queryData) {
    return {
      props: {
        notFound: true,
      },
    }
  }

  return {
    props: {
      // Work around see – https://github.com/TanStack/query/issues/1458#issuecomment-747716357
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      notFound: false,
    },
  }
}

export default OrderEditPage
