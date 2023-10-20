import { useSearchParams } from "react-router-dom"
import Header from "../components/organism/Header"
import ContactForm from "../components/templates/ContactForm"

const Form = () => {
  const [searchParams] = useSearchParams()
  const id = searchParams.get("id")
  const title = id ? "Edit Contact" : "Add Contact"
  return (
    <>
      <Header
        title={title}
        backPath={"/"}
      />
      <ContactForm />
    </>
  )
}

export default Form