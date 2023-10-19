import { FC } from "react"
import Button from "../atoms/Button"
import { FlexJustifyEnd } from "../atoms/Flex"

interface Props {
  loading: boolean
  onCancel: () => void
}

const ButtonActionform: FC<Props> = ({ loading, onCancel }) => {
  return (
    <FlexJustifyEnd>
      <Button disabled={loading} type="button" bg="red" color="white" onClick={onCancel}>
        Cancel
      </Button>
      <Button disabled={loading} type="submit" bg="green" color="black">
        Save
      </Button>
    </FlexJustifyEnd>
  )
}

export default ButtonActionform