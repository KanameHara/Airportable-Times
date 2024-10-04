//----------------------------------------------------------------
// ページの見出しコンポーネント
//----------------------------------------------------------------
import React, { FC } from 'react';
import { Box, Flex } from '@chakra-ui/react';

interface PageHeadingProps {
  title: string | undefined;
}

const PageHeading: FC<PageHeadingProps> = ({ title }) => {
  return (
    <Flex alignItems="center">
      <Box 
        width="10px"
        height="50px"
        bg="blue.500"
        mr={3}
      />
      <Box fontSize="3xl" fontWeight="bold">
        {title}
      </Box>
    </Flex>
  );
};

export default React.memo(PageHeading);