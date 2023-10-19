import { FC, ReactElement } from "react"
import ButtonIcon from "../atoms/ButtonIcon"
import styled from "@emotion/styled"
import ChevronLeftIcon from "../../icons/ChevronLeftIcon"
import { css } from "@emotion/css"
import { useNavigate } from "react-router-dom"
import Container from "../atoms/Container"

interface Props {
  title?: string,
  backPath?: string
  rightAction?: ReactElement
}

const Header: FC<Props> = ({ backPath, title, rightAction }) => {
  const navigate = useNavigate()

  return (
    <HeaderStyled>
      <Container>
        <div className="header-content">
          <div className="left-panel">
            {backPath &&
              <ButtonIcon
                onClick={() => navigate(backPath)}
                size="small"
                bg="white"
                color="black"
                className={css({ marginLeft: -8 })}
              >
                <ChevronLeftIcon width={36} />
              </ButtonIcon>
            }
            {title && <h1>{title}</h1>}
          </div>
          {rightAction && rightAction}
        </div>
      </Container>
    </HeaderStyled>
  )
}

export default Header

const HeaderStyled = styled.header`
border-bottom: 1px solid var(--gray);
padding: 0.6rem 0;

.header-content{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;

    .left-panel {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
}
`