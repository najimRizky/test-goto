import { ChangeEvent, FormEvent, useState } from "react"
import Container from "../atoms/Container"
import FormControl from "../molecules/FormControl"
import Button from "../atoms/Button"
import { parseAndSetFormValue } from "../../utils/form-helper"
import { useNavigate } from "react-router-dom"
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
  const [addContactWithPhones, { loading }] = useMutation(ADD_CONTACT_WITH_PHONES, {
    refetchQueries: [
      GET_CONTACT_LIST,
      "GetContactList"
    ]
  })

  const navigate = useNavigate()
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
      }).then((data) => {
        const id = data.data?.insert_contact?.returning[0].id
        navigate(`/${id}`)
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
            <Button disabled={loading} className={css({ marginTop: "1rem" })} type="submit" width={"100%"}>Submit</Button>
          </form>
        </Container>
      </MainContent>
    </>
  )
}

export default ContactForm