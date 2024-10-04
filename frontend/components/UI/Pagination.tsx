//----------------------------------------------------------------
// ページネーションのコンポーネント
//----------------------------------------------------------------
import React, { FC } from 'react';
import { Button, Flex } from '@chakra-ui/react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Flex justifyContent="center" mb={5}>
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i}
          onClick={() => onPageChange(i + 1)}
          disabled={currentPage === i + 1}
          mx={1}
          colorScheme={currentPage === i + 1 ? 'cyan' : 'gray'}
        >
          {i + 1}
        </Button>
      ))}
    </Flex>
  );
};

export default React.memo(Pagination);