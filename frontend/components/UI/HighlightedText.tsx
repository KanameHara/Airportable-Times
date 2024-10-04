//----------------------------------------------------------------
// ハイライトテキストコンポーネント
//----------------------------------------------------------------
import { Box, Text } from '@chakra-ui/react';
import React, { FC } from 'react';

interface HighlightedTextProps {
  text: string;
}

const HighlightedText: FC<HighlightedTextProps> = ({ text }) => {
  return (
    <Box 
      bg="gray.200"
      p={1.5}
      borderRadius="5px"
      width="100%"
    >
      <Text fontWeight="bold" fontSize="lg" color="blue.800">
        {text}
      </Text>
    </Box>
  );
};

export default React.memo(HighlightedText);
