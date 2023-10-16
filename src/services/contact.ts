import { TypedDocumentNode, gql } from "@apollo/client";

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
  contact: Contact[];
}

interface GetContactListType {
  contact?: Contact[];
  limit?: number;
  offset?: number;
  total?: number;
  where?: any;
}

export const GET_CONTACT_LIST: TypedDocumentNode<Data, GetContactListType> = gql`
query GetContactList (
  $distinct_on: [contact_select_column!], 
  $limit: Int, 
  $offset: Int, 
  $order_by: [contact_order_by!], 
  $where: contact_bool_exp
) {
  contact (
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
}`