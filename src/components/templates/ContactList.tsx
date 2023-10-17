import { FC } from "react"
import Container from "../atoms/Container"
import { useMutation, useQuery } from "@apollo/client"
import { ADD_CONTACT_WITH_PHONES, GET_CONTACT_LIST } from "../../services/contact"

const ContactList: FC = () => {
  const { loading, error, data, refetch } = useQuery(GET_CONTACT_LIST, {
    variables: { limit: 100 },
  })

  const [addContactWithPhones, { data: dataNew, loading: loadingNew, error: errorNew }] = useMutation(ADD_CONTACT_WITH_PHONES, {
    refetchQueries: [
      GET_CONTACT_LIST,
      "GetContactList"
    ]
  })

  const handleSubmit = async () => {
    try {
      await addContactWithPhones({
        variables: {
          first_name: "Ersys",
          last_name: "GG3",
          phones: [{
            number: "456789876",
          }]
        }
      })

      alert("Contact added")
    } catch (error) {
      console.log(error)
      alert("Error")
    }
  }

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
      <button onClick={handleSubmit}>Add Contact</button>
    </Container>
  )
}

export default ContactList