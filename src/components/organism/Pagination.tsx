import { useNavigate } from "react-router-dom"
import { FC } from "react"
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import ButtonIcon from "../atoms/ButtonIcon";
import ChevronLeftIcon from "../../icons/ChevronLeftIcon";
import ChevronRightIcon from "../../icons/ChevronRightIcon";
import Container from "../atoms/Container";

interface Props {
  page: number;
  totalPage: number;
}

const Pagination: FC<Props> = ({ page, totalPage }) => {
  const navigate = useNavigate();

  const handlePrevPage = () => {
    if (page === 1) return;
    navigate(`/?page=${page - 1}`);
  };

  const handleNextPage = () => {
    if (page === totalPage) return;
    navigate(`/?page=${page + 1}`);
  };

  return (
    <Container>
      <PaginationStyled>
        <ButtonIcon
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          <ChevronLeftIcon />
        </ButtonIcon>
        <PageNumbers page={page} totalPage={totalPage} />
        <ButtonIcon
          onClick={handleNextPage}
          disabled={page === totalPage}
        >
          <ChevronRightIcon />
        </ButtonIcon>
      </PaginationStyled>
    </Container>
  );
};

const PaginationStyled = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  gap: 0.5rem;
`;

const PageNumbers = ({ page, totalPage }: any) => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  const visiblePages = !isMobile ? Array.from({ length: totalPage }, (_, i) => i + 1).reduce(
    (acc: any, curr: any) => {
      if (curr === 1 || curr === totalPage) {
        acc.push(curr);
      } else if (curr === page - 1 || curr === page || curr === page + 1) {
        acc.push(curr);
      } else if (acc[acc.length - 1] !== "...") {
        acc.push("...");
      }
      return acc;
    }, []
  ) : // show only 3 pages on mobile view
    [page - 1, page, page + 1].filter((pageNumber) => pageNumber > 0 && pageNumber <= totalPage);


  return (
    <>
      {visiblePages.map((pageNumber: any, index: any) => {
        const isCurrentPage = pageNumber === page;
        const isDots = pageNumber === "...";

        return (
          <ButtonIcon
            key={index}
            onClick={() => {
              if (isDots) return;
              navigate(`/?page=${pageNumber}`);
            }}
            bg={isCurrentPage ? "primary" : "gray-light"}
            color={isCurrentPage ? "white" : "black"}
            className={css({
              cursor: isDots ? "default" : "pointer",
            })}
          >
            {pageNumber}
          </ButtonIcon>
        );
      })}
    </ >
  );
};

export default Pagination;