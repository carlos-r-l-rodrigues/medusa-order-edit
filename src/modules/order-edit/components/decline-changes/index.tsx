import { useForm } from "react-hook-form"
import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import React, { useState } from "react"
import Spinner from "@modules/common/icons/spinner"
import { useOrderEditContext } from "@lib/context/order-edit-context"

type FormValues = {
  reason: string
}

const DeclineOrderChanges = () => {

  const {
    orderEdit,
    setOrderEditStatus,
    setDeclineOrderEdit,
  } = useOrderEditContext()

  if (orderEdit.status !== "requested") {
    return <></>
  }

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>()

  const submit = handleSubmit(async (data: FormValues) => {
    setSubmitting(true)
    setError(undefined)

    setDeclineOrderEdit({
        declined_reason: data.reason
      },
      {
        onSuccess: ({ order_edit }) => {
          orderEdit.declined_reason = order_edit.declined_reason

          setSubmitting(false)
          setOrderEditStatus(order_edit.status)
        },
        onError: () => {
          setSubmitting(false)
          setError("Failed to decline the Order Edit, please try again.")
        }
    })
  })

  return (
    <div>
      Decline Reason
      <Input
        label="Reason"
        {...register("reason", {
          required: "Reason to decline is required",
        })}
        required
        errors={errors}
        autoComplete=""
      />

      <Button className="min-h-0" onClick={submit} disabled={submitting}>
        Decline Changes
        {submitting && <Spinner />}
      </Button>

      {error && (
        <div className="text-rose-500 text-small-regular py-2">{error}</div>
      )}
    </div>
  )
}

export default DeclineOrderChanges
