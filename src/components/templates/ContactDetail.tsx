import { useQuery } from "@apollo/client"
import { GET_CONTACT_DETAIL } from "../../services/contact"
import { useParams } from "react-router-dom"
import MainContent from "../atoms/MainContent"
import Container from "../atoms/Container"
import { FlexJustifyBetween } from "../atoms/Flex"
import Text from "../atoms/Text"
import Header from "../organism/Header"
import { css } from "@emotion/css"
import Button from "../atoms/Button"
import PhoneCard from "../organism/PhoneCard"
import Avatar from "../atoms/Avatar"

const ContactDetail = () => {
  const params = useParams()
  const id = Number(params.id || 0)

  const { data, loading } = useQuery(GET_CONTACT_DETAIL, {
    variables: { id }
  })

  const { contact } = data || { contact: null }

  if (loading) return <p>Loading...</p>
  if (!contact) return <p>Error {":("}</p>

  const fullName = `${contact.first_name} ${contact.last_name}`
  const initial = `${contact.first_name[0] || ""}${contact.last_name[0] || ""}`.toUpperCase()

  return (
    <>
      <Header
        backButton
        title="Contact Detail"
      />
      <MainContent>
        <Container>
          <Avatar size={"extraLarge"} className={css({fontSize: "2rem", margin: "0 auto 1rem auto"})}>
            {initial}
          </Avatar>
          <Text.H1 className={css({ textAlign: "center" })}>
            {fullName}
          </Text.H1>
          <div className={css({ marginTop: "2rem" })}>
            <FlexJustifyBetween>
              <Text.H2>
                Phones
              </Text.H2>
              <Button>
                + Add Phone
              </Button>
            </FlexJustifyBetween>
            <div className={css({ marginTop: "1rem" })}>
              {contact.phones.map((phone, index) => (
                <PhoneCard
                  key={index}
                  number={phone.number}
                  contactId={contact.id}
                />
              ))}
            </div>
          </div>
        </Container>
      </MainContent>
    </>
  )
}

export default ContactDetail