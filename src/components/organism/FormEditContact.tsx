import { FC, useState } from "react"
import FormControl from "../molecules/FormControl"
import Button from "../atoms/Button"
import { useMutation } from "@apollo/client"
import { GET_CONTACT_DETAIL, UPDATE_CONTACT } from "../../services/contact"
import {FlexJustifyEnd } from "../atoms/Flex"

interface Props {
  onClose: () => void
  data: {
    first_name: string
    last_name: string
  }
  contactId: number
}

const FormEditContact: FC<Props> = ({ onClose, data, contactId }) => {
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

  console.log(loading)

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

      <FlexJustifyEnd>
        <Button disabled={loading} type="button" bg="red" color="white" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} type="submit" bg="green" color="black">
          Save
        </Button>
      </FlexJustifyEnd>

    </form>
  )
}

export default FormEditContact