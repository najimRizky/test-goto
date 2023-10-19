import { FC, useState } from "react"
import FormControl from "../molecules/FormControl"
import ButtonActionform from "../molecules/ButtonActionform"
import { useMutation } from "@apollo/client"
import { ADD_PHONE, EDIT_PHONE, GET_CONTACT_DETAIL } from "../../services/contact"

interface Props {
  onClose: () => void
  data?: string // phone number
  contactId: number
}

const FormAddEditPhone: FC<Props> = ({ onClose, data, contactId }) => {
  const [addPhone, { loading: loadingAddPhone }] = useMutation(ADD_PHONE, {
    refetchQueries: [
      GET_CONTACT_DETAIL,
      `GetContactDetail`
    ]
  })

  const [editPhone, { loading: loadingEditPhone }] = useMutation(EDIT_PHONE, {
    refetchQueries: [
      GET_CONTACT_DETAIL,
      `GetContactDetail`
    ]
  })

  const [form, setForm] = useState(data || "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setForm(value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (data) {
      handleEditPhone()
    } else {
      handleAddPhone()
    }
  }

  const handleAddPhone = () => {
    addPhone({
      variables: {
        contact_id: contactId,
        phone_number: form
      }
    }).then(() => {
      onClose()
    }).catch(() => {
      alert("Error")
    })
  }

  const handleEditPhone = () => {
    editPhone({
      variables: {
        pk_columns: {
          contact_id: contactId,
          number: data
        },
        new_phone_number: form
      }
    }).then(() => {
      onClose()
    }).catch(() => {
      alert("Error")
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControl
        label="Phone Number"
        type="text"
        value={form}
        onChange={handleChange}
        fieldName="phone"
        placeholder="Enter phone number"
        required
      />
      <ButtonActionform
        loading={loadingAddPhone || loadingEditPhone}
        onCancel={onClose}
      />
    </form>
  )
}

export default FormAddEditPhone