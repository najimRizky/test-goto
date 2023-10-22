import { FC, Fragment, useMemo } from "react"
import ContactCard from "../organism/ContactCard"
import { isAlphaNumeric } from "../../utils/string-helper"
import { css } from "@emotion/css"
import FloatingActionButton from "../molecules/FloatingActionButton"
import PlusIcon from "../../icons/PlusIcon"
import { NavLink, useSearchParams } from "react-router-dom"
import Spinner from "../atoms/Spinner"
import Container from "../atoms/Container"
import Text from "../atoms/Text"
import Pagination from "../organism/Pagination"
import { useContact } from "../../providers/ContactProvider"
import { Contact } from "../../services/contact"

const per_page = 10

const ContactList: FC = () => {
  const [searchParam] = useSearchParams()
  const page = parseInt(searchParam.get("page") || "1")
  const search = searchParam.get("search") || ""

  const { getContacts, getFavoriteContacts, loading } = useContact()

  const { contacts, length } = useMemo(() => getContacts(page, search), [page, search, getContacts])
  const favoriteContacts = useMemo(() => getFavoriteContacts(), [getFavoriteContacts])
  // const contacts: Contact[] = []
  // const length = 0
  // const favoriteContacts: Contact[] = []
  const totalData = length || 0
  const totalPage = Math.ceil(totalData / per_page)

  const renderList = (data: Contact[], onEmpty: string) => {
    if (!data || data?.length === 0) return (
      <Container>
        <Text.P >{onEmpty}</Text.P>
      </Container>
    )

    let initial = ""
    const contactList = data.map((contact) => {
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
  }

  const renderContactList = useMemo(() => {
    return renderList(contacts, "No Contact Found")
  }, [contacts])

  const renderFavoriteContactList = useMemo(() => {
    return renderList(favoriteContacts, "No Favorite Contact Found")
  }, [favoriteContacts])

  if (loading) return <Spinner spaceY="2rem" />
  // if (error) return <ErrorBox />

  return (
    <>
      <main className={css({ marginBottom: "2rem", minHeight: "70vh" })}>
        <Container>
          <Text.H2 className={css({ margin: "1rem 0 0.5rem 0" })}>Favorite Contact</Text.H2>
        </Container>
        {renderFavoriteContactList}
        <Container>
          <Text.H2 className={css({ margin: "1rem 0 0.5rem 0" })}>Regular Contact</Text.H2>
        </Container>
        {renderContactList}
      </main>
      {totalData > 0 && (
        <Pagination page={page} totalPage={totalPage} />
      )}
      <NavLink to="/form">
        <FloatingActionButton
          isIcon={true}
          position="bottom-right"
          data-testid="add-contact-btn"
          size="medium"
        >
          <PlusIcon width={36} />
        </FloatingActionButton>
      </NavLink>
    </>
  )
}

export default ContactList