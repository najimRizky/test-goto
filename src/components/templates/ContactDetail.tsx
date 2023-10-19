import { useQuery } from "@apollo/client"
import { GET_CONTACT_DETAIL } from "../../services/contact"
import { useParams } from "react-router-dom"
import MainContent from "../atoms/MainContent"
import Container from "../atoms/Container"
import { FlexJustifyBetween, FlexJustifyCenter } from "../atoms/Flex"
import Text from "../atoms/Text"
import Header from "../organism/Header"
import { css } from "@emotion/css"
import Button from "../atoms/Button"
import PhoneCard from "../organism/PhoneCard"
import Avatar from "../atoms/Avatar"
import Modal from "../molecules/Modal"
import useModal from "../../hooks/useModal"
import FormEditContact from "../organism/FormEditContact"
import ButtonIcon from "../atoms/ButtonIcon"
import PencilIcon from "../../icons/PencilIcon"
import TrashIcon from "../../icons/TrashIcon"
import { useState } from "react"
import FormPhone from "../organism/FormPhone"

const ContactDetail = () => {
  const { handleClose: handleCloseEdit, handleOpen: handleOpenEdit, isOpen: isOpenedit } = useModal()
  const { handleClose: handleClosePhone, handleOpen: handleOpenPhone, isOpen: isOpenPhone } = useModal()

  const [selectedPhone, setSelectedPhone] = useState<string>()

  const handleFormPhone = (number: string = "") => {
    if (number) setSelectedPhone(number)

    handleOpenPhone()
  }

  const handleCloseFormPhone = () => {
    setSelectedPhone(undefined)
    handleClosePhone()
  }

  const params = useParams()
  const id = Number(params.id || 0)

  const { data, loading } = useQuery(GET_CONTACT_DETAIL, { variables: { id } })
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
          <Avatar size={"extraLarge"} className={css({ fontSize: "2rem", margin: "0 auto 1rem auto" })}>
            {initial}
          </Avatar>
          <Text.H1 className={css({ textAlign: "center" })}>
            {fullName}
          </Text.H1>
          <FlexJustifyCenter className={css({ marginTop: "1rem" })}>
            <ButtonIcon onClick={handleOpenEdit} bg="yellow" color="black" size="small" >
              <PencilIcon width={18} />
            </ButtonIcon>
            <ButtonIcon onClick={handleOpenEdit} bg="red" color="white" size="small" >
              <TrashIcon width={18} />
            </ButtonIcon>
          </FlexJustifyCenter>
          <div className={css({ marginTop: "2rem" })}>
            <FlexJustifyBetween>
              <Text.H2>
                Phones
              </Text.H2>
              <Button onClick={() => handleFormPhone()}>
                + Add Phone
              </Button>
            </FlexJustifyBetween>
            <div className={css({ marginTop: "1rem" })}>
              {contact.phones.map((phone, index) => (
                <PhoneCard
                  key={index}
                  number={phone.number}
                  onEdit={() => handleFormPhone(phone.number)}
                  onDelete={() => console.log("delete")}
                />
              ))}
            </div>
          </div>
        </Container>
      </MainContent>

      {/* Form Edit Contact*/}
      <Modal isOpen={isOpenedit} onClose={handleCloseEdit} title="Edit Contact">
        <FormEditContact
          contactId={id}
          data={{
            first_name: contact.first_name,
            last_name: contact.last_name
          }}
          onClose={handleCloseEdit}
        />
      </Modal>

      {/* Form Add/Edit Phone */}
      <Modal isOpen={isOpenPhone} onClose={handleCloseFormPhone} title={selectedPhone ? "Edit Phone" : "Add Phone"}>
        <FormPhone
          contactId={id}
          data={selectedPhone}
          onClose={handleCloseFormPhone}
        />
      </Modal>
    </>
  )
}

export default ContactDetail