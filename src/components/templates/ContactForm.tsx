/* eslint-disable indent */
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
import Avatar from "../atoms/Avatar"
import { useNotification } from "../../providers/NotificationProvider"
import { isAlphaNumeric } from "../../utils/string-helper"

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
  phones: []
}

const rules: {
  [key: string]: {
    required: boolean
    minLength: number
    maxLength: number
    alphanumeric: boolean
  }

} = {
  first_name: {
    required: true,
    alphanumeric: true,
    minLength: 1,
    maxLength: 50
  },
  last_name: {
    required: false,
    alphanumeric: true,
    minLength: 0,
    maxLength: 50
  },
  phones: {
    required: true,
    minLength: 8,
    maxLength: 20,
    alphanumeric: true
  }
}

const ContactForm = () => {
  const navigate = useNavigate()
  const { addNotification } = useNotification()

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
  const [errors, setErrors] = useState<any>(deepCopy(initialForm))
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
      if (detailContact?.contact?.phones[index]) {
        newForm.phones[index].number = detailContact?.contact?.phones[index].number
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

    const newErrors = deepCopy(errors)
    if (type.includes("phone")) {
      newErrors.phones[index].number = ""
    }
    if (type === "contact") {
      newErrors.first_name = ""
      newErrors.last_name = ""
    }

    setErrors(newErrors)
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
        setErrors({
          first_name: "",
          last_name: "",
          phones: phones.map(() => ({ number: "" }))
        })
      } else {
        throw new Error("Contact not found")
      }
    }).catch(() => {
      addNotification({
        message: "Contact not found",
        type: "error"
      })
    })
  }

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedForm = parseAndSetFormValue(name, value, { ...form });
    setForm(updatedForm);

    const updatedErrors = parseAndSetFormValue(name, "", { ...errors });
    setErrors(updatedErrors);
  }

  // Handle submit all (add contact with phones)
  const handleSubmitAll = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const hasError = validateForm()
    if (hasError) return

    addContactWithPhones({
      variables: form
    }).then((data) => {
      navigate(`/form?id=${data.data?.insert_contact?.returning[0].id}`)
      addNotification({
        message: "Contact added successfully",
        type: "success"
      })
    }).catch(() => {
      addNotification({
        message: "Error adding contact",
        type: "error"
      })
    })
  }

  // Handle add phone
  const handleAddPhone = () => {
    const newForm = deepCopy(form)
    newForm.phones.push({ number: "" })
    setForm(newForm)

    const newErrors = deepCopy(errors)
    newErrors.phones.push({ number: "" })
    setErrors(newErrors)

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

      const newErrors = deepCopy(errors)
      newErrors.phones.splice(index, 1)
      setErrors(newErrors)
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
        addNotification({
          message: "Phone number deleted successfully",
          type: "success"
        })
      }).catch(() => {
        addNotification({
          message: "Error deleting phone number",
          type: "error"
        })
      })
    }
  }

  // Handle submit add/edit phone
  const handleSubmitPhone = (index: number) => {
    if (detailContact?.contact?.phones[index]) { // Edit
      const invalidPhone = validateField("phones", form.phones[index].number)
      if (invalidPhone) {
        const newErrors = deepCopy(errors)
        newErrors.phones[index].number = invalidPhone
        setErrors(newErrors)
        return
      }

      editPhone({
        variables: {
          pk_columns: {
            contact_id: Number(id),
            number: detailContact?.contact?.phones[index].number
          },
          new_phone_number: form.phones[index].number
        }
      }).then(() => {
        fetchDetail()
        toggleEditMode(`phone-${index}`, false)
        addNotification({
          message: "Phone number edited successfully",
          type: "success"
        })
      }).catch(() => {
        addNotification({
          message: "Error editing phone number",
          type: "error"
        })
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
        addNotification({
          message: "Phone number added successfully",
          type: "success"
        })
      }).catch(() => {
        addNotification({
          message: "Error adding phone number",
          type: "error"
        })
      })
    }
  }

  // Handle submit edit contact (first name, last name)
  const handleSubmitEditContact = () => {
    const invalidFirstName = validateField("first_name", form.first_name)
    const invalidLastName = validateField("last_name", form.last_name)

    if (invalidFirstName || invalidLastName) {
      setErrors({
        ...errors,
        first_name: invalidFirstName,
        last_name: invalidLastName
      })
      return
    }

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
      addNotification({
        message: "Contact edited successfully",
        type: "success"
      })
    }).catch(() => {
      addNotification({
        message: "Error editing contact",
        type: "error"
      })
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
      addNotification({
        message: "Error deleting contact",
        type: "error"
      })
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

  const validateField = (fieldName: string, value: any) => {
    const rule = rules[fieldName]
    if (!rule) return

    const arrayRule = Object.keys(rule)
    let error = ""

    for (let i = 0; i < arrayRule.length; i++) {
      switch (arrayRule[i]) {
        case "required":
          if (!value) {
            console.log(fieldName)
            error = "This field is required"
          }
          break;
        case "minLength":
          if (value.length < rule.minLength) {
            error = `Minimum length is ${rule.minLength}`
          }
          break;
        case "maxLength":
          if (value.length > rule.maxLength) {
            error = `Maximum length is ${rule.maxLength}`
          }
          break;
        case "alphanumeric":
          if (!isAlphaNumeric(value)) {
            error = "Only alphanumeric allowed"
          }
          break;
      }
      if (error) break
    }
    return error
  }


  const validateForm = () => {
    const newErrors = deepCopy(errors)
    let hasError = false
    Object.keys(form).forEach((key) => {
      if (key === "phones") {
        form[key].forEach((phone, index) => {
          const error = validateField(key, phone.number)
          if (error) hasError = true
          newErrors[key as keyof Form][index].number = error
        })
      } else {
        const error = validateField(key, form[key as keyof Form])
        if (error) hasError = true
        newErrors[key as keyof Form] = error
      }
    })
    setErrors(newErrors)
    return hasError
  }

  const initialAvatar = `${detailContact?.contact?.first_name[0] || ""} ${detailContact?.contact?.last_name[0] || ""}`.toUpperCase()

  return (
    <>
      <MainContent>
        {id && (
          <Avatar size="extraLarge" className={css({ margin: "0 auto 3rem auto", fontSize: "1.5rem" })} >
            {initialAvatar}
          </Avatar>
        )}

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
                        color="white"
                        bg="red"
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
              error={errors.first_name}
            />
            <FormControl
              label="Last Name"
              type="text"
              value={form.last_name}
              onChange={handleChange}
              fieldName="last_name"
              placeholder="Enter last name"
              disabled={!editMode?.contact && !!id}
              error={errors.last_name}
            />
            <FlexJustifyBetween className={css({ marginTop: "1.5rem", })}>
              <Text.H1 size="lg">
                Phone Number
              </Text.H1>
              <Button
                // disabled if there is an empty phone number
                disabled={form.phones.some((phone) => !phone.number)}
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
                  error={errors.phones[index]?.number}
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
                          color="white"
                          bg="red"
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
                    color="white"
                    bg="red"
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