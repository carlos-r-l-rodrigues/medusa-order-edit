import { useForm } from "react-hook-form"
import Button from "@modules/common/components/button"
import React, { useState } from "react"
import Spinner from "@modules/common/icons/spinner"
import { useOrderEditContext } from "@lib/context/order-edit-context"

const AcceptOrderChanges = ({text = "Accept Order Edit"}: {text?: string}) => {
  const {
    orderEdit,
    setOrderEditStatus,
    setCompleteOrderEdit,
  } = useOrderEditContext()

  if (orderEdit.status !== "requested") {
    return <></>
  }

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const {
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submit = handleSubmit(async () => {
    setSubmitting(true)
    setError(undefined)

    setCompleteOrderEdit(orderEdit.id,
      {
        onSuccess: ({ order_edit }) => {
          setSubmitting(false)
          setOrderEditStatus(order_edit.status)
        },
        onError: () => {
          setSubmitting(false)
          setError("Failed to accept the Order Edit, please try again.")
        }
    })
  })

  return (
    <div>
      <Button className="min-h-0" onClick={submit} disabled={submitting}>
        {text}
        {submitting && <Spinner />}
      </Button>

      {error && (
        <div className="text-rose-500 text-small-regular py-2">{error}</div>
      )}
    </div>
  )
}

export default AcceptOrderChanges
