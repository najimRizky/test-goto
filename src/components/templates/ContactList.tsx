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
import Spinner from "../atoms/Spinner"
import ErrorBox from "../organism/ErrorBox"
import Container from "../atoms/Container"
import Text from "../atoms/Text"

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
    if (!data?.contacts || data?.contacts?.length === 0) return <Text.P className={css({textAlign: "center", paddingTop: "8rem"})}>No Contact Found</Text.P>

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
            <Container
              className={css({
                padding: "0.25rem 0 0.5rem 1.9rem !important",
                borderTop: "1px solid transparent",
                borderBottom: "1px solid var(--gray-light)",
                fontWeight: 600,
                color: "var(--gray-dark)",
                fontSize: "0.875rem",
              })}
            >
              {initial}
            </Container>}
          <ContactCard contact={contact} />
        </Fragment>
      )
    })

    return contactList
  }, [data])

  if (loading) return <Spinner spaceY="2rem" />
  if (error) return <ErrorBox />

  return (
    <>
      <main className={css({ marginBottom: "5rem", minHeight: "80vh" })}>
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