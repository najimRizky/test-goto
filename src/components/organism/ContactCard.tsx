import { FC } from "react"
import { Contact } from "../../services/contact"
import styled from "@emotion/styled"
import TextMuted from "../atoms/TextMuted"
import TrippleDotIcon from "../../icons/TrippleDotIcon"
import Dropdown from "../molecules/Dropdown"
import ButtonIcon from "../atoms/ButtonIcon"
import Avatar from "../atoms/Avatar"

interface Props {
  contact: Contact
}

const ContactCard: FC<Props> = ({ contact }) => {
  const fullName = `${contact.first_name} ${contact.last_name}`
  const phones = contact.phones.map((phone) => phone.number).join(", ")
  const avatarInitial = `${contact.first_name[0] || ""}${contact.last_name[0] || ""}`.toUpperCase()

  return (
    <ContactCardStyled>
      <div className="content">
        <Avatar>
          {avatarInitial}
        </Avatar>
        <div className="info">
          <h3 className="full-name">{fullName}</h3>
          <TextMuted className="phones">
            {phones || "No phone number"} 
          </TextMuted>
        </div>
      </div>
      <Dropdown
        trigger={
          <ButtonIcon bg="white" color="black">
            <TrippleDotIcon />
          </ButtonIcon>
        }
        menu={[
          {
            label: "Edit",
            onClick: () => {
              alert("Edit")
            }
          },
          {
            label: "Delete",
            onClick: () => {
              alert("Delete")
            }
          }
        ]}
      />
    </ContactCardStyled>
  )
}

export default ContactCard

const ContactCardStyled = styled.div`
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex; 
  justify-content: space-between;
  align-items: center;

  /* &:active {
    background-color: var(--gray-light);
  } */

  &:first-of-type {
    border-top: 1px solid var(--gray-light);
  }

  .content {
    max-width: 85%;
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