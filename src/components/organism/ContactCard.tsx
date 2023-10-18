import { FC } from "react"
import { Contact } from "../../services/contact"
import styled from "@emotion/styled"
import TextMuted from "../atoms/TextMuted"
import TrippleDotIcon from "../../icons/TrippleDotIcon"
import Dropdown from "../molecules/Dropdown"
import ButtonIcon from "../atoms/ButtonIcon"

interface Props {
  contact: Contact
}

const ContactCard: FC<Props> = ({ contact }) => {
  const fullName = `${contact.first_name} ${contact.last_name}`
  const phones = contact.phones.map((phone) => phone.number).join(", ")

  return (
    <ContactCardStyled>
      <div className="info">
        <h3 className="full-name">{fullName}</h3>
        <TextMuted className="phones">
          {phones || "No phone number"}
        </TextMuted>
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

  .info {
    max-width: 85%;
    .full-name {
      font-size: 1rem;
      font-weight: 600;
    }
  
    .phones {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.8rem;
    }
  }
  
`