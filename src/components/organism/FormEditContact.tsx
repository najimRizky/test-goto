import { FC, useState } from "react"
import FormControl from "../molecules/FormControl"
import { useMutation } from "@apollo/client"
import { GET_CONTACT_DETAIL, UPDATE_CONTACT } from "../../services/contact"
import ButtonActionform from "../molecules/ButtonActionform"
import { useNavigate } from "react-router-dom"

interface Props {
  onClose: () => void
  data: {
    first_name: string
    last_name: string
  }
  contactId: number
}

const FormEditContact: FC<Props> = ({ onClose, data, contactId }) => {
  const navigate = useNavigate()

  const [updateContact, { loading }] = useMutation(UPDATE_CONTACT, {
    refetchQueries: [
      GET_CONTACT_DETAIL,
      `GetContactDetail`
    ]
  })

  const [form, setForm] = useState({
    first_name: data.first_name,
    last_name: data.last_name
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateContact({
      variables: {
        id: contactId,
        _set: {
          first_name: form.first_name,
          last_name: form.last_name
        }
      }
    }).then(() => {
      onClose()
      navigate(`/${contactId}`, { state: {}, replace: true })
    }).catch(() => {
      alert("Error")
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControl
        label="First Name"
        type="text"
        value={form.first_name}
        onChange={handleChange}
        fieldName="first_name"
        placeholder="Enter first name"
        required
      />
      <FormControl
        label="Last Name"
        type="text"
        value={form.last_name}
        onChange={handleChange}
        fieldName="last_name"
        placeholder="Enter last name"
      />

      <ButtonActionform
        loading={loading}
        onCancel={onClose}
      />
    </form>
  )
}

export default FormEditContact