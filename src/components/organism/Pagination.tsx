import { useNavigate } from "react-router-dom"
import Button from "../atoms/Button"
import { FC } from "react"
import styled from "@emotion/styled";
import { css } from "@emotion/css";

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
    <PaginationStyled>
      <Button onClick={handlePrevPage}>&lt;</Button>
      <PageNumbers page={page} totalPage={totalPage} />
      <Button onClick={handleNextPage}>&gt;</Button>
    </PaginationStyled>
  );
};

const PaginationStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  gap: 1rem;
`;

const PageNumbers = ({ page, totalPage }: any) => {
  const navigate = useNavigate();
  // Determine when to shorten the list of page numbers based on screen size

  const visiblePages = Array.from({ length: totalPage }, (_, i) => i + 1).reduce(
    (acc: any, curr: any) => {
      if (curr === 1 || curr === totalPage) {
        acc.push(curr);
      } else if (curr === page - 1 || curr === page || curr === page + 1) {
        acc.push(curr);
      } else if (acc[acc.length - 1] !== "...") {
        acc.push("...");
      }
      return acc;
    },
    []
  );


  return (
    <div>
      {visiblePages.map((pageNumber: any, index: any) => {
        const isCurrentPage = pageNumber === page;
        const isDots = pageNumber === "...";

        return (
          <Button
            key={index}
            onClick={() => {
              if (isDots) return;
              navigate(`/?page=${pageNumber}`);
            }}
            className={css({
              fontWeight: isCurrentPage ? "bold" : "normal",
              textDecoration: isDots ? "none" : "underline",
              cursor: isDots ? "default" : "pointer",
            })}
          >
            {pageNumber}
          </Button>
        );
      })}
    </div >
  );
};

export default Pagination;