import { FC, Fragment, useMemo } from "react"
import ContactCard from "../organism/ContactCard"
import { isAlphaNumeric } from "../../utils/string-helper"
import { css } from "@emotion/css"
import FloatingActionButton from "../molecules/FloatingActionButton"
import PlusIcon from "../../icons/PlusIcon"
import { useNavigate, useSearchParams } from "react-router-dom"
import Spinner from "../atoms/Spinner"
import Container from "../atoms/Container"
import Text from "../atoms/Text"
import Pagination from "../organism/Pagination"
import { useContact } from "../../providers/ContactProvider"

const per_page = 10

const ContactList: FC = () => {
  const navigate = useNavigate()
  const [searchParam] = useSearchParams()
  const page = parseInt(searchParam.get("page") || "1")
  const search = searchParam.get("search") || ""

  const { getContacts, getFavoriteContacts, loading } = useContact()

  const { contacts, length } = useMemo(() => getContacts(page, search), [page, search, getContacts])
  const favoriteContacts = useMemo(() => getFavoriteContacts(), [getFavoriteContacts])
  const totalData = length || 0
  const totalPage = Math.ceil(totalData / per_page)

  const renderContactList = useMemo(() => {
    if (!contacts || contacts?.length === 0) return <Text.P className={css({ textAlign: "center", paddingTop: "8rem" })}>No Contact Found</Text.P>

    let initial = ""
    const contactList = contacts.map((contact) => {
      const firstLetter = contact?.first_name[0]?.toUpperCase()
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
  }, [contacts])

  const renderFavoriteContactList = useMemo(() => {
    if (!favoriteContacts || favoriteContacts?.length === 0) return <Text.P className={css({ textAlign: "center", paddingTop: "8rem" })}>No Favorite Contact Found</Text.P>

    let initial = ""
    const contactList = favoriteContacts.map((contact) => {
      const firstLetter = contact?.first_name[0]?.toUpperCase()
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
  }, [favoriteContacts])

  if (loading) return <Spinner spaceY="2rem" />
  // if (error) return <ErrorBox />

  return (
    <>
      <main className={css({ marginBottom: "2rem", minHeight: "70vh" })}>
        {favoriteContacts?.length > 0 && (
          <>
            <Container>
              <Text.H2 className={css({ margin: "1rem 0 0.5rem 0" })}>Favorite</Text.H2>
            </Container>
            {renderFavoriteContactList}
          </>
        )}
        <Container>
          <Text.H2 className={css({ margin: "1rem 0 0.5rem 0" })}>All Contact</Text.H2>
        </Container>
        {renderContactList}
      </main>
      {totalData > 0 && (
        <Pagination page={page} totalPage={totalPage} />
      )}
      <FloatingActionButton
        onClick={() => navigate("/form")}
        isIcon={true}
        position="bottom-right"
      >
        <PlusIcon width={42} />
      </FloatingActionButton>
    </>
  )
}

export default ContactList