import Header from "../components/organism/Header"
import ContactForm from "../components/templates/ContactForm"
// import AddContactForm from "../components/templates/AddContactForm"

const Form = () => {
  return (
    <>
      <Header
        title={"Add Contact"}
        backPath={"/"}
      />
      {/* <AddContactForm /> */}
      <ContactForm />
    </>
  )
}

export default Form