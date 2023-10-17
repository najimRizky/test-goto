import { FC, Fragment, useMemo } from "react"
import {
  // useMutation,
  useQuery
} from "@apollo/client"
import {
  // ADD_CONTACT_WITH_PHONES,
  GET_CONTACT_LIST
} from "../../services/contact"
import ContactCard from "../organism/ContactCard"
import { isAlphaNumeric } from "../../utils/string-helper"
import { css } from "@emotion/css"
import FloatingActionButton from "../molecules/FloatingActionButton"
import PlusIcon from "../../icons/PlusIcon"
import { useNavigate } from "react-router-dom"

const ContactList: FC = () => {
  const navigate = useNavigate()

  const { loading, error, data } = useQuery(GET_CONTACT_LIST, {
    variables: {
      limit: 10,
      order_by: {
        first_name: "asc",
        last_name: "asc"
      }
    },
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
                padding: "0.25rem 1rem",
                borderBottom: "1px solid var(--gray-light)",
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
      <main>
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