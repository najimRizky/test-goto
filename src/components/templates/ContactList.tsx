import { FC } from "react"
import Container from "../atoms/Container"
import { useQuery } from "@apollo/client"
import { GET_CONTACT_LIST } from "../../services/contact"

const ContactList: FC = () => {
  const { loading, error, data } = useQuery(GET_CONTACT_LIST, {
    variables: { limit: 10},
    notifyOnNetworkStatusChange: true,
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error </p>

  return (
    <Container>
      {data?.contact.map((contact: any) => (
        <div key={contact?.id}>
          <p>
            {contact?.first_name} {contact?.last_name}
          </p>
        </div>
      ))}
    </Container>
  )
}

export default ContactList