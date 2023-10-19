import { useLazyQuery, useMutation } from "@apollo/client"
import { ADD_CONTACT_WITH_PHONES, ADD_PHONE, DELETE_CONTACT, DELETE_PHONE, EDIT_CONTACT, EDIT_PHONE, GET_CONTACT_DETAIL } from "../../services/contact"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { deepCopy } from "../../utils/object-helper"
import { parseAndSetFormValue } from "../../utils/form-helper"
import MainContent from "../atoms/MainContent"
import Container from "../atoms/Container"
import FormControl from "../molecules/FormControl"
import { Flex, FlexJustifyBetween } from "../atoms/Flex"
import { css } from "@emotion/css"
import Text from "../atoms/Text"
import Button from "../atoms/Button"
import ButtonIcon from "../atoms/ButtonIcon"
import TextMuted from "../atoms/TextMuted"
import TrashIcon from "../../icons/TrashIcon"
import PencilIcon from "../../icons/PencilIcon"
import CheckIcon from "../../icons/CheckIcon"
import CloseIcon from "../../icons/CloseIcon"
import ModalDelete from "../organism/ModalDelete"

interface Form {
  first_name: string
  last_name: string
  phones: {
    number: string
  }[]
}

const initialForm: Form = {
  first_name: "",
  last_name: "",
  phones: [{
    number: ""
  }]
}

const ContactForm = () => {
  const navigate = useNavigate()

  // Get id from url
  const [searchParams] = useSearchParams()
  const id = searchParams.get("id")

  // Queries and Mutations
  const [addContactWithPhones, { loading: loadingAdd }] = useMutation(ADD_CONTACT_WITH_PHONES)
  const [getContactDetail, { data: detailContact }] = useLazyQuery(GET_CONTACT_DETAIL, { fetchPolicy: "no-cache" })
  const [editContact] = useMutation(EDIT_CONTACT)
  const [deleteContact] = useMutation(DELETE_CONTACT)
  const [addPhone] = useMutation(ADD_PHONE)
  const [deletePhone] = useMutation(DELETE_PHONE)
  const [editPhone] = useMutation(EDIT_PHONE)

  // States
  const [form, setForm] = useState<Form>(deepCopy(initialForm))
  const [editMode, setEditMode] = useState<any>()
  const [deleteProps, setDeleteProps] = useState<{ isOpen?: boolean; message?: string; onConfirm?: () => void }>()

  // Fetch detail on mount if id is present
  useEffect(() => {
    if (id) {
      fetchDetail()
    }
  }, [id])

  // Toggle edit mode
  const toggleEditMode = (type: string, status: boolean) => {
    setEditMode({ ...editMode, [type]: status })
  }

  // Handle cancel edit
  const handleCancelEdit = (type: string, index: number = 0) => {
    const newForm = deepCopy(form)
    if (type.includes("phone")) {
      if (detailContact?.contact.phones[index]) {
        newForm.phones[index].number = detailContact?.contact.phones[index].number
      } else {
        newForm.phones.splice(index, 1)
      }
    }

    if (type === "contact") {
      const { first_name, last_name } = detailContact?.contact || { first_name: "", last_name: "" }
      newForm.first_name = first_name
      newForm.last_name = last_name
    }

    setForm(newForm)
    toggleEditMode(type, false)
  }

  // Fetch contact detail
  const fetchDetail = () => {
    getContactDetail({
      variables: { id: Number(id) }
    }).then((data) => {
      const contact = data.data?.contact
      if (contact) {
        const { first_name, last_name, phones } = contact
        setForm({
          first_name,
          last_name,
          phones: phones.map((phone) => ({ number: phone.number }))
        })
      } else {
        throw new Error("Contact not found")
      }
    }).catch(() => {
      alert("Error fetching contact detail")
    })
  }

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedForm = parseAndSetFormValue(name, value, { ...form });
    setForm(updatedForm);
  }

  // Handle submit all (add contact with phones)
  const handleSubmitAll = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    addContactWithPhones({
      variables: form
    }).then((data) => {
      navigate(`/form?id=${data.data?.insert_contact?.returning[0].id}`)
    }).catch(() => {
      alert("Error")
    })
  }

  // Handle add phone
  const handleAddPhone = () => {
    const newForm = deepCopy(form)
    newForm.phones.push({ number: "" })
    setForm(newForm)

    if (id) {
      toggleEditMode(`phone-${newForm.phones.length - 1}`, true)
    }
  }

  // Handle delete phone
  const handleSubmitDeletePhone = (index: number) => {
    if (!id) {
      const newForm = deepCopy(form)
      newForm.phones.splice(index, 1)
      setForm(newForm)
    } else {
      deletePhone({
        variables: {
          contact_id: Number(id),
          number: form.phones[index].number
        }
      }).then(() => {
        fetchDetail()
        toggleEditMode(`phone-${index}`, false)
        setDeleteProps({ isOpen: false })
      }).catch(() => {
        alert(`Error deleting phone number ${index}`)
      })
    }
  }

  // Handle submit add/edit phone
  const handleSubmitPhone = (index: number) => {
    if (detailContact?.contact.phones[index]) {
      editPhone({
        variables: {
          pk_columns: {
            contact_id: Number(id),
            number: detailContact?.contact.phones[index].number
          },
          new_phone_number: form.phones[index].number
        }
      }).then(() => {
        fetchDetail()
        toggleEditMode(`phone-${index}`, false)
      }).catch(() => {
        alert(`Error editing phone number ${index}`)
      })
    } else {
      addPhone({
        variables: {
          contact_id: Number(id),
          phone_number: form.phones[index].number
        }
      }).then(() => {
        fetchDetail()
        toggleEditMode(`phone-${index}`, false)
      }).catch(() => {
        alert(`Error adding phone number ${index}`)
      })
    }
  }

  // Handle submit edit contact (first name, last name)
  const handleSubmitEditContact = () => {
    editContact({
      variables: {
        id: Number(id),
        _set: {
          first_name: form.first_name,
          last_name: form.last_name
        }
      }
    }).then(() => {
      fetchDetail()
      toggleEditMode("contact", false)
    }).catch(() => {
      alert("Error editing contact")
    })
  }

  // Handle submit delete contact (Whole contact)
  const handleSubmitDeleteContact = () => {
    deleteContact({
      variables: {
        id: Number(id)
      }
    }).then(() => {
      navigate("/")
    }).catch(() => {
      alert("Error deleting contact")
    })
  }

  // Handle submit delete (Show modal confirmation)
  const handleSubmitDelete = (type: string, index: number = 0) => {
    if (type === "contact") {
      setDeleteProps({
        isOpen: true,
        message: "Are you sure you want to delete this contact?",
        onConfirm: () => {
          handleSubmitDeleteContact()
        }
      })
    }

    if (type.includes("phone")) {
      setDeleteProps({
        isOpen: true,
        message: "Are you sure you want to delete this phone number?",
        onConfirm: () => {
          handleSubmitDeletePhone(index)
        }
      })
    }
  }

  return (
    <>
      <MainContent>
        <Container>
          <form onSubmit={handleSubmitAll}>
            <FlexJustifyBetween>
              <Text.H1 size="lg">
                Personal Information
              </Text.H1>
              {id && (
                <Flex>
                  {!editMode?.contact ? (
                    <>
                      <ButtonIcon
                        type="button"
                        onClick={() => toggleEditMode("contact", true)}
                        size="small"
                        bg="yellow"
                        color="black"
                      >
                        <PencilIcon width={18} />
                      </ButtonIcon>
                      <ButtonIcon
                        onClick={() => handleSubmitDelete("contact")}
                        type="button"
                        size="small"
                        color="red"
                        bg="gray-light"
                      >
                        <TrashIcon width={18} />
                      </ButtonIcon>
                    </>
                  ) : (
                    <>
                      <ButtonIcon
                        type="button"
                        onClick={() => handleSubmitEditContact()}
                        size="small"
                        bg="green"
                        color="black"
                      >
                        <CheckIcon width={18} />
                      </ButtonIcon>
                      < ButtonIcon
                        onClick={() => handleCancelEdit("contact")}
                        type="button"
                        size="small"
                        color="black"
                        bg="gray-light"
                      >
                        <CloseIcon width={18} />
                      </ButtonIcon>
                    </>
                  )}
                </Flex>
              )}
            </FlexJustifyBetween>
            <FormControl
              label="First Name"
              type="text"
              value={form.first_name}
              onChange={handleChange}
              fieldName="first_name"
              placeholder="Enter first name"
              disabled={!editMode?.contact && !!id}
            />
            <FormControl
              label="Last Name"
              type="text"
              value={form.last_name}
              onChange={handleChange}
              fieldName="last_name"
              placeholder="Enter last name"
              disabled={!editMode?.contact && !!id}
            />
            <FlexJustifyBetween className={css({ marginTop: "1.5rem", })}>
              <Text.H1 size="lg">
                Phone Number
              </Text.H1>
              <Button
                type="button"
                onClick={handleAddPhone}
                className={css({ height: "2rem !important" })}
              >
                + Add Phone
              </Button>

            </FlexJustifyBetween>
            {form.phones.length > 0 ? form.phones.map((phone, index) => (
              <FlexJustifyBetween key={index} >
                <FormControl
                  label={`Phone ${index + 1}`}
                  type="tel"
                  value={phone.number}
                  onChange={handleChange}
                  fieldName={`phones.${index}.number`}
                  placeholder={`Enter phone number`}
                  disabled={!editMode?.[`phone-${index}`] && !!id}
                />
                {id ? (
                  <>
                    {!editMode?.[`phone-${index}`] ? (
                      <>
                        <ButtonIcon
                          type="button"
                          onClick={() => toggleEditMode(`phone-${index}`, true)}
                          size="small"
                          bg="yellow"
                          color="black"
                        >
                          <PencilIcon width={18} />
                        </ButtonIcon>
                        <ButtonIcon
                          onClick={() => handleSubmitDelete(`phone-${index}`, index)}
                          type="button"
                          size="small"
                          color="red"
                          bg="gray-light"
                        >
                          <TrashIcon width={18} />
                        </ButtonIcon>
                      </>
                    ) : (
                      <>
                        <ButtonIcon
                          type="button"
                          onClick={() => handleSubmitPhone(index)}
                          size="small"
                          bg="green"
                          color="black"
                        >
                          <CheckIcon width={18} />
                        </ButtonIcon>
                        < ButtonIcon
                          onClick={() => handleCancelEdit(`phone-${index}`, index)}
                          type="button"
                          size="small"
                          color="black"
                          bg="gray-light"
                        >
                          <CloseIcon width={18} />
                        </ButtonIcon>
                      </>
                    )}
                  </>
                ) : (
                  <ButtonIcon
                    onClick={() => handleSubmitDeletePhone(index)}
                    type="button"
                    size="small"
                    color="red"
                    bg="gray-light"
                  >
                    <TrashIcon width={18} />
                  </ButtonIcon>
                )}
              </FlexJustifyBetween>
            )) : (
              <TextMuted>No phone number</TextMuted>
            )}
            {!id && (
              <Button disabled={loadingAdd} className={css({ marginTop: "1rem" })} type="submit" width={"100%"}>Submit</Button>
            )}
          </form>
        </Container>
      </MainContent >

      <ModalDelete
        isOpen={deleteProps?.isOpen || false}
        message={deleteProps?.message}
        onClose={() => setDeleteProps({ isOpen: false })}
        onConfirm={deleteProps?.onConfirm}
      />
    </>
  )
}

export default ContactForm