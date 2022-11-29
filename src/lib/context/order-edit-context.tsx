import { medusaClient } from "@lib/config"

import { OrderEdit, Order, PaymentSession } from "@medusajs/medusa"

import {
  useCompleteOrderEdit,
  useDeclineOrderEdit,
  useManagePaymentSessions,
} from "medusa-react"

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

interface OrderEditContext {
  activeSessions: PaymentSession[]
  orderEdit?: OrderEdit
  order: Order
  isLoading: boolean
  managePaymentSessions: (
    index: number,
    key: string,
    providerId: string,
    paymentSession?: PaymentSession
  ) => void
  onPaymentCompleted: (paymentSession: PaymentSession) => void
  paymentCollectionStatus: string
  orderEditStatus: string
  setDeclineOrderEdit: any
  setOrderEditStatus: any
  setCompleteOrderEdit: any
}

const OrderEditContext = createContext<OrderEditContext | null>(null)

interface OrderEditProviderProps {
  orderEdit?: OrderEdit
  children?: React.ReactNode
}

export const OrderEditProvider = ({
  orderEdit,
  children,
}: OrderEditProviderProps) => {
  const paymentCollectionId = orderEdit?.payment_collection?.id

  const {
    mutate: setManagePaymentSessions,
    isLoading: settingPaymentSessions,
  } = useManagePaymentSessions(paymentCollectionId)

  const { mutate: setDeclineOrderEdit, isLoading: settingDecliningOrderEdit } =
    useDeclineOrderEdit(orderEdit?.id)

  const {
    mutate: setCompleteOrderEdit,
    isLoading: settingCompletingOrderEdit,
  } = useCompleteOrderEdit(orderEdit?.id)

  const fillSessions = (paymentSessions) => {
    if (!paymentSessions) {
      return []
    }

    const active: PaymentSession[] = []
    for (let i = 0; i < paymentSessions.length; i++) {
      const key = i + "_" + paymentSessions[i].provider_id
      active[i] = {
        [key]: paymentSessions[i],
      }
    }

    return active
  }

  const [activeSessions, setActiveSessions]: PaymentSession[] = useState(
    fillSessions(orderEdit?.payment_collection?.payment_sessions)
  )

  const [paymentCollectionStatus, setPaymentCollectionStatus] = useState(
    orderEdit?.payment_collection?.status
  )
  const [orderEditStatus, setOrderEditStatus] = useState(orderEdit?.status)

  /**
   * Boolean that indicates if a part of the orderedit is loading.
   */
  const isLoading = useMemo(() => {
    return (
      settingPaymentSessions ||
      settingDecliningOrderEdit ||
      settingCompletingOrderEdit
    )
  }, [
    settingPaymentSessions,
    settingDecliningOrderEdit,
    settingCompletingOrderEdit,
  ])

  const managePaymentSessions = (
    index: number,
    key: string,
    providerId: string,
    paymentSession?: PaymentSession
  ) => {
    const active = { ...activeSessions }
    if (!active[index]) {
      active[index] = {}
    }

    if (active[index][key]) {
      return
    }

    setManagePaymentSessions(
      {
        sessions: {
          provider_id: providerId,
          customer_id: "customer-1",
          amount: orderEdit.payment_collection.amount,
          session_id: paymentSession?.id,
        },
      },
      {
        onSuccess: ({ payment_collection }) => {
          orderEdit.payment_collection.payment_sessions =
            payment_collection.payment_sessions

          active[index] = {
            [key]: payment_collection.payment_sessions[index],
          }

          setActiveSessions(() => active)
        },
      }
    )
  }

  /**
   * Method to complete the orderedit process. This is called when the user clicks the "Complete OrderEdit" button.
   */
  const onPaymentCompleted = async (paymentSession: PaymentSession) => {
    // check all completed sessions
    //authorize
    return await medusaClient.paymentCollections
      .authorize(paymentCollectionId)
      .then(({ payment_collection }) => {
        setCompleteOrderEdit(orderEdit.id, {
          onSuccess: ({ order_edit }) => {
            setOrderEditStatus(order_edit.status)
            setPaymentCollectionStatus(payment_collection.status)
          },
          onError: () => {
            setPaymentCollectionStatus(payment_collection.status)
          },
        })
      })
  }

  return (
    <OrderEditContext.Provider
      value={{
        orderEdit: orderEdit,
        order: orderEdit?.order,
        activeSessions,

        isLoading,
        managePaymentSessions,
        onPaymentCompleted,
        paymentCollectionStatus,
        orderEditStatus,
        setOrderEditStatus,
        setDeclineOrderEdit,
        setCompleteOrderEdit,
      }}
    >
      {children}
    </OrderEditContext.Provider>
  )
}

export const useOrderEditContext = () => {
  const context = useContext(OrderEditContext)

  if (context === null) {
    throw new Error(
      "useOrderEditContext must be used within a OrderEditProvider"
    )
  }
  return context
}
