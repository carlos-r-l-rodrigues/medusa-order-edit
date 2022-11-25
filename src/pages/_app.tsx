import { MEDUSA_BACKEND_URL, queryClient } from "@lib/config"
import { OrderEditProvider } from "@lib/context/order-edit-context"
import { MedusaProvider } from "medusa-react"
import { Hydrate } from "react-query"
import "styles/globals.css"
import { AppPropsWithLayout } from "types/global"

function App({
  Component,
  pageProps,
}: AppPropsWithLayout<{ dehydratedState?: unknown }>) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <MedusaProvider
      baseUrl={MEDUSA_BACKEND_URL}
      queryClientProviderProps={{
        client: queryClient,
      }}
    >
      <Hydrate state={pageProps.dehydratedState}>
          <OrderEditProvider>
            {getLayout(<Component {...pageProps} />)}
          </OrderEditProvider>

      </Hydrate>
    </MedusaProvider>
  )
}

export default App
