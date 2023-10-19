import { FC } from "react"
import { Contact } from "../../services/contact"
import styled from "@emotion/styled"
import TextMuted from "../atoms/TextMuted"
import TrippleDotIcon from "../../icons/TrippleDotIcon"
import Dropdown from "../molecules/Dropdown"
import ButtonIcon from "../atoms/ButtonIcon"
import Avatar from "../atoms/Avatar"
import { NavLink, useNavigate } from "react-router-dom"
import Container from "../atoms/Container"
import Text from "../atoms/Text"
import { Flex } from "../atoms/Flex"
import PencilIcon from "../../icons/PencilIcon"
import { css } from "@emotion/css"
import TrashIcon from "../../icons/TrashIcon"

interface Props {
  contact: Contact
}

const ContactCard: FC<Props> = ({ contact }) => {
  const navigate = useNavigate()
  const fullName = `${contact.first_name} ${contact.last_name}`
  const phones = contact.phones.map((phone) => phone.number).join(", ")
  const avatarInitial = `${contact.first_name[0] || ""}${contact.last_name[0] || ""}`.toUpperCase()

  return (
    <ContactCardStyled>
      <NavLink className="content" to={`/${contact.id}`}>
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
            onClick: () => { navigate(`/${contact.id}?editContact=true`) }
          },
          {
            label: <Flex className={css({ gap: "0.5rem !important", color:"var(--red-dark)" })}>
              <TrashIcon width={18} />Delete Contact
            </Flex>,
            onClick: () => {
              alert("Delete")
            }
          },
          ...contact.phones.slice(0,2).map((phone, index) => ({
            label: <Text.P className={css({textOverflow: "ellipsis", whiteSpace: "nowrap", width: "9rem", overflow: "hidden"})}>
              Edit {phone.number}
            </Text.P>,
            onClick: () => { navigate(`/${contact.id}?editPhone=${index}`) }
          }))
        ]}
      />
    </ContactCardStyled>
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