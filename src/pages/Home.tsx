import Header from "../components/organism/Header"
import SearchInput from "../components/organism/SearchInput"
import ContactList from "../components/templates/ContactList"

const Home = () => {
  return (
    <>
      <Header title="Contacts" />
      <SearchInput />
      <ContactList />
    </>
  )
}

export default Home