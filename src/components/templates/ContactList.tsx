import { FC } from "react"
import {
  // useMutation,
  useQuery
} from "@apollo/client"
import {
  // ADD_CONTACT_WITH_PHONES,
  GET_CONTACT_LIST
} from "../../services/contact"
import ContactCard from "../organism/ContactCard"

const ContactList: FC = () => {
  const { loading, error, data } = useQuery(GET_CONTACT_LIST, {
    variables: { limit: 10 },
  })

  // const [addContactWithPhones, { data: dataNew, loading: loadingNew, error: errorNew }] = useMutation(ADD_CONTACT_WITH_PHONES, {
  //   refetchQueries: [
  //     GET_CONTACT_LIST,
  //     "GetContactList"
  //   ]
  // })

  // const handleSubmit = async () => {
  //   try {
  //     await addContactWithPhones({
  //       variables: {
  //         first_name: "Ersys",
  //         last_name: "GG3",
  //         phones: [{
  //           number: "456789876",
  //         }]
  //       }
  //     })

  //     alert("Contact added")
  //   } catch (error) {
  //     console.log(error)
  //     alert("Error")
  //   }
  // }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error </p>

  return (
    <>
      <main>
        {data?.contacts.map((contact: any) => (
          <ContactCard contact={contact} key={contact.id} />
        ))}
      </main>
      {/* <button onClick={handleSubmit}>Add Contact</button> */}
    </>
  )
}

export default ContactList