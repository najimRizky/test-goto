import { FC, useState } from "react"
import { Contact, DELETE_CONTACT, GET_CONTACT_LIST } from "../../services/contact"
import styled from "@emotion/styled"
import TextMuted from "../atoms/TextMuted"
import TrippleDotIcon from "../../icons/TrippleDotIcon"
import Dropdown from "../molecules/Dropdown"
import ButtonIcon from "../atoms/ButtonIcon"
import Avatar from "../atoms/Avatar"
import { NavLink, useNavigate } from "react-router-dom"
import Container from "../atoms/Container"
import { Flex } from "../atoms/Flex"
import PencilIcon from "../../icons/PencilIcon"
import { css } from "@emotion/css"
import TrashIcon from "../../icons/TrashIcon"
import ModalDelete from "./ModalDelete"
import { useMutation } from "@apollo/client"
import { useNotification } from "../../providers/NotificationProvider"

interface Props {
  contact: Contact
}

const ContactCard: FC<Props> = ({ contact }) => {
  const { addNotification } = useNotification()
  const navigate = useNavigate()
  const fullName = `${contact.first_name} ${contact.last_name}`
  const phones = contact.phones.map((phone) => phone.number).join(", ")
  const avatarInitial = `${contact?.first_name[0] || ""}${contact?.last_name[0] || ""}`.toUpperCase()

  const [deleteContact] = useMutation(DELETE_CONTACT, {
    refetchQueries: [
      GET_CONTACT_LIST,
      "GetContactList"
    ]
  })

  const [deleteProps, setDeleteProps] = useState<{ onConfirm?: () => void, isOpen: boolean, }>({
    isOpen: false,
    onConfirm: undefined
  })

  const handleDeleteContact = (id: string) => {
    deleteContact({
      variables: { id: Number(id) }
    }).then(() => {
      setDeleteProps({ onConfirm: undefined, isOpen: false })
      addNotification({
        message: "Contact deleted successfully",
        type: "success"
      })
    }).catch(() => {
      addNotification({
        message: "Failed to delete contact",
        type: "error"
      })
    })
  }

  const handleDelete = (id: string) => {
    setDeleteProps({
      isOpen: true,
      onConfirm: () => handleDeleteContact(id)
    })
  }

  const handleCloseDelete = () => {
    setDeleteProps({ onConfirm: undefined, isOpen: false })
  }

  return (
    <>
      <ContactCardStyled>
        <NavLink className="content" to={`/form?id=${contact.id}`}>
          <Avatar>
            {avatarInitial}
          </Avatar>
          <div className="info">
            <h3 className="full-name">
              {fullName}
            </h3>
            <TextMuted className="phones">
              {phones || "No phone number"}
            </TextMuted>
          </div>
        </NavLink>
        <Dropdown
          trigger={
            <ButtonIcon bg="white" color="black">
              <TrippleDotIcon />
            </ButtonIcon>
          }
          menu={[
            {
              label: <Flex className={css({ gap: "0.5rem !important" })}>
                <PencilIcon width={18} />Edit Contact
              </Flex>,
              onClick: () => { navigate(`/form?id=${contact.id}`) }
            },
            {
              label: <Flex className={css({ gap: "0.5rem !important", color: "var(--red-dark)" })}>
                <TrashIcon width={18} />Delete Contact
              </Flex>,
              onClick: () => handleDelete(contact.id)
            },
          ]}
        />
      </ContactCardStyled>

      {/* Modal Delete */}
      <ModalDelete
        isOpen={deleteProps?.isOpen}
        onClose={() => handleCloseDelete()}
        message="Are you sure want to delete this contact?"
        onConfirm={deleteProps?.onConfirm}
      />
    </>
  )
}

export default ContactCard

const ContactCardStyled = styled(Container)`
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex; 
  justify-content: space-between;
  align-items: center;
  transition: var(--transition);

  @media (hover: hover) {
    &:hover {
      box-shadow: var(--shadow);
    }
  }

  &:first-of-type {
    border-top: 1px solid var(--gray-light);
  }

  .content {
    flex-grow: 1;
    display: flex;
    gap: 0.75rem;
    align-items: center;

    .info {
      max-width: 90%;
      display: grid;
      gap: 0.5rem;

      .full-name {
        font-size: 1rem;
        font-weight: 600;
      }
    
      .phones {
        max-width: 100%;
        font-size: 0.8rem;
      }
      
      .full-name, .phones {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1;
      }
    }

  }
  
`