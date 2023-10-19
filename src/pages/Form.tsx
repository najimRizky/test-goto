import Header from "../components/organism/Header"
import AddContactForm from "../components/templates/AddContactForm"

const Form = () => {
  return (
    <>
      <Header
        title={"Add Contact"}
        backPath={"/"}
      />
      <AddContactForm />
    </>
  )
}

export default Form