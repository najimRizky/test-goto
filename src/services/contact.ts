import { TypedDocumentNode, gql } from "@apollo/client";

interface QueryVariables {
  limit?: number;
  offset?: number;
  total?: number;
  where?: any;
  order_by?: any;
}

interface Phone {
  number: string;
}

export interface Contact {
  created_at: string;
  first_name: string;
  id: string;
  last_name: string;
  phones: Phone[];
}

interface Data {
  contacts: Contact[];
}

export const GET_CONTACT_LIST: TypedDocumentNode<Data, QueryVariables> = gql`
query GetContactList (
  $distinct_on: [contact_select_column!], 
  $limit: Int, 
  $offset: Int, 
  $order_by: [contact_order_by!], 
  $where: contact_bool_exp
) {
  contacts: contact (
    distinct_on: $distinct_on, 
    limit: $limit, 
    offset: $offset, 
    order_by: $order_by, 
    where: $where
) {
    created_at
    first_name
    id
    last_name
    phones {
      number
    }
  }
  metadata: contact_aggregate {
    aggregate{
      count
    }
  }
}`

interface AddContactTypeWithPhonesType {
  first_name: string;
  last_name: string;
  phones: Phone[];
}

export const ADD_CONTACT_WITH_PHONES: TypedDocumentNode<any, AddContactTypeWithPhonesType> = gql`
mutation AddContactWithPhones(
    $first_name: String!, 
    $last_name: String!, 
    $phones: [phone_insert_input!]!
    ) {
  insert_contact(
      objects: {
          first_name: $first_name, 
          last_name: 
          $last_name, phones: { 
              data: $phones
            }
        }
    ) {
    returning {
      first_name
      last_name
      id
      phones {
        number
      }
    }
  }
}
`

export const GET_CONTACT_DETAIL: TypedDocumentNode<{ contact: Contact }, { id: number }> = gql`
query GetContactDetail($id: Int!){
  contact: contact_by_pk(id: $id) {
    last_name
    id
    first_name
    created_at
    phones {
      number
    }
  }
}
`

interface UpdateContactType {
  id: number;
  _set: {
    first_name?: string;
    last_name?: string;
    phones?: Phone[];
  }
}

export const UPDATE_CONTACT: TypedDocumentNode<any, UpdateContactType> = gql`
mutation EditContactById($id: Int!, $_set: contact_set_input) {
  update_contact_by_pk(pk_columns: {id: $id}, _set: $_set) {
    first_name
    last_name
  }
}


`