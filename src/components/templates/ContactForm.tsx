import { ChangeEvent, FormEvent, useState } from "react"
import Container from "../atoms/Container"
import FormControl from "../molecules/FormControl"
import Button from "../atoms/Button"
import { parseAndSetFormValue } from "../../utils/form-helper"
import Header from "../organism/Header"
import { useNavigate, useSearchParams } from "react-router-dom"
import { FlexJustifyBetween } from "../atoms/Flex"
import Text from "../atoms/Text"
import { deepCopy } from "../../utils/object-helper"
import ButtonIcon from "../atoms/ButtonIcon"
import TrashIcon from "../../icons/TrashIcon"
import TextMuted from "../atoms/TextMuted"
import MainContent from "../atoms/MainContent"
import { css } from "@emotion/css"
import { useMutation } from "@apollo/client"
import { ADD_CONTACT_WITH_PHONES, GET_CONTACT_LIST } from "../../services/contact"

// interface ValidationProps {
//   required?: boolean
//   minLength?: number
//   maxLength?: number
//   pattern?: RegExp
//   array?: boolean
// }

// export interface ValidationSchema {
//   [key: string]: ValidationProps | ValidationSchema | ValidationSchema[]
// }

// const validationSchema: ValidationSchema = {
//   first_name: {
//     required: true,
//     minLength: 3,
//   },
//   last_name: {
//     required: false,
//     minLength: 3,
//   },
//   phones: [{
//     number: {
//       required: true,
//       minLength: 3,
//     }
//   }]
// }

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
  const [addContactWithPhones, { loading, error, data }] = useMutation(ADD_CONTACT_WITH_PHONES, {
    refetchQueries: [
      GET_CONTACT_LIST,
      "GetContactList"
    ]
  })

  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const id = searchParams.get("id")

  const [form, setForm] = useState<Form>(deepCopy(initialForm))
  const [errors, setErrors] = useState(deepCopy(initialForm))

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedForm = parseAndSetFormValue(name, value, { ...form });
    setForm(updatedForm);

    const updatedErrors = parseAndSetFormValue(name, "", { ...errors });
    setErrors(updatedErrors);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const isValid = validate()

    if (isValid) {
      addContactWithPhones({
        variables: form
      }).then(() => {
        navigate("/")
      }).catch(() => {
        alert("Error")
      })
    }
  }

  const addPhone = () => {
    const newForm = deepCopy(form)
    newForm.phones.push({ number: "" })
    setForm(newForm)

    const newErrors = deepCopy(errors)
    newErrors.phones.push({ number: "" })
    setErrors(newErrors)
  }

  const deletePhone = (index: number) => {
    const newForm = deepCopy(form)
    newForm.phones.splice(index, 1)
    setForm(newForm)

    const newErrors = deepCopy(errors)
    newErrors.phones.splice(index, 1)
    setErrors(newErrors)
  }

  const validate = () => {
    // TODO: validate form
    return true
  }

  return (
    <>
      <Header
        title={id ? "Edit Contact" : "Add Contact"}
        backButton={true}
      />
      <MainContent>
        <Container>
          <form onSubmit={handleSubmit}>
            <FormControl
              label="First Name"
              type="text"
              value={form.first_name}
              onChange={handleChange}
              fieldName="first_name"
              error={errors.first_name}
              placeholder="Enter first name"
            />
            <FormControl
              label="Last Name"
              type="text"
              value={form.last_name}
              onChange={handleChange}
              fieldName="last_name"
              placeholder="Enter last name"
            />
            <FlexJustifyBetween className={css({ marginTop: "1rem", })}>
              <Text.H1 size="lg">
                Phone Number
              </Text.H1>
              <Button
                type="button"
                onClick={addPhone}
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
                  error={errors.phones[index]?.number}
                  placeholder={`Enter phone number`}
                />
                <ButtonIcon
                  onClick={() => deletePhone(index)}
                  type="button"
                  size="small"
                  color="red"
                  bg="gray-light"
                >
                  <TrashIcon width={18} />
                </ButtonIcon>
              </FlexJustifyBetween>
            )) : (
              <TextMuted>No phone number</TextMuted>
            )}
            <Button className={css({ marginTop: "1rem" })} type="submit" width={"100%"}>Submit</Button>
          </form>
        </Container>
      </MainContent>
    </>
  )
}

export default ContactForm