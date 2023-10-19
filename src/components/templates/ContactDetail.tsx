import { useMutation, useQuery } from "@apollo/client"
import { DELETE_CONTACT, DELETE_NUMBER, GET_CONTACT_DETAIL } from "../../services/contact"
import { useNavigate, useParams } from "react-router-dom"
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
import ModalDelete from "../organism/ModalDelete"

const ContactDetail = () => {
  const navigate = useNavigate()

  const { handleClose: handleCloseEdit, handleOpen: handleOpenEdit, isOpen: isOpenedit } = useModal()
  const { handleClose: handleClosePhone, handleOpen: handleOpenPhone, isOpen: isOpenPhone } = useModal()

  const [deleteContact] = useMutation(DELETE_CONTACT)
  const [deletePhone] = useMutation(DELETE_NUMBER)

  const [selectedPhone, setSelectedPhone] = useState<string>()
  const [deleteProps, setDeleteProps] = useState<{
    onConfirm?: () => void,
    message: string,
    isOpen: boolean,
  }>()

  const params = useParams()
  const id = Number(params.id || 0)

  const { data, loading, refetch } = useQuery(GET_CONTACT_DETAIL, { variables: { id } })
  const { contact } = data || { contact: null }

  const handleFormPhone = (number: string = "") => {
    if (number) setSelectedPhone(number)

    handleOpenPhone()
  }

  const handleCloseFormPhone = () => {
    setSelectedPhone(undefined)
    handleClosePhone()
  }

  const handleDelete = (type: "contact" | "phone", data: any) => {
    let message = ""
    let onConfirm = undefined
    if (type === "contact") {
      message = "Are you sure you want to delete this contact?"
      onConfirm = () => handleDeleteContact()
    } else {
      message = "Are you sure you want to delete this phone?"
      onConfirm = () => handleDeletePhone(data.number)
    }
    setDeleteProps({
      message,
      onConfirm,
      isOpen: true
    })
  }

  const handleDeletePhone = (phone: string) => {
    deletePhone({
      variables: {
        contact_id: id,
        number: phone
      }
    }).then(() => {
      refetch()
      setDeleteProps({
        isOpen: false,
        message: "",
        onConfirm: undefined
      })
    }).catch(() => {
      alert("error")
    })
  }

  const handleDeleteContact = () => {
    deleteContact({
      variables: {
        id
      }
    }).then(() => {
      navigate("/")
    }).catch(() => {
      alert("error")
    })
  }

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
            <ButtonIcon onClick={() => handleDelete("contact", contact)} bg="red" color="white" size="small" >
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
              {contact.phones.length > 0 ? contact.phones.map((phone, index) => (
                <PhoneCard
                  key={index}
                  number={phone.number}
                  onEdit={() => handleFormPhone(phone.number)}
                  onDelete={() => handleDelete("phone", phone)}
                />
              )) : (
                <Text.P>
                  No phone number
                </Text.P>
              )}
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

      {/* Modal Delete Contact/Phone */}
      <ModalDelete
        isOpen={deleteProps?.isOpen || false}
        onClose={() => setDeleteProps(undefined)}
        onConfirm={deleteProps?.onConfirm}
        message={deleteProps?.message}
      />
    </>
  )
}

export default ContactDetail