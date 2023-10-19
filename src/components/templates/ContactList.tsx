import { FC, Fragment, useMemo } from "react"
import {
  useQuery
} from "@apollo/client"
import {
  GET_CONTACT_LIST
} from "../../services/contact"
import ContactCard from "../organism/ContactCard"
import { isAlphaNumeric } from "../../utils/string-helper"
import { css } from "@emotion/css"
import FloatingActionButton from "../molecules/FloatingActionButton"
import PlusIcon from "../../icons/PlusIcon"
import { useNavigate } from "react-router-dom"
import Header from "../organism/Header"

const ContactList: FC = () => {
  const navigate = useNavigate()

  const { loading, error, data } = useQuery(GET_CONTACT_LIST, {
    variables: {
      limit: 20,
      order_by: {
        first_name: "asc",
        last_name: "asc"
      }
    },
    fetchPolicy: "network-only"
  })

  const renderContactList = useMemo(() => {
    let initial = ""
    const contactList = data?.contacts.map((contact) => {
      const firstLetter = contact.first_name[0].toUpperCase()
      let showInitial = false
      if (initial !== firstLetter && isAlphaNumeric(firstLetter)) {
        initial = firstLetter
        showInitial = true
      }

      return (
        <Fragment key={contact.id}>
          {showInitial &&
            <div
              className={css({
                padding: "0.25rem 0 0.5rem 1.9rem",
                borderTop: "1px solid transparent",
                borderBottom: "1px solid var(--gray-light)",
                fontWeight: 600,
                color: "var(--gray-dark)",
                fontSize: "0.875rem",
              })}
            >
              {initial}
            </div>}
          <ContactCard contact={contact} />
        </Fragment>
      )
    })

    return contactList
  }, [data])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error </p>

  return (
    <>
      <Header title="Contacts" />
      <main className={css({marginBottom: "5rem"})}>
        {renderContactList}
      </main>
      <FloatingActionButton
        onClick={() => navigate("/form")}
        isIcon={true}
        position="bottom-right"
      >
        <PlusIcon width={42} />
      </FloatingActionButton>
      {/* <button onClick={handleSubmit}>Add Contact</button> */}
    </>
  )
}

export default ContactList