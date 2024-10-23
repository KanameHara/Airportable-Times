//----------------------------------------------------------------
// 全ページのフッターコンポーネント
//----------------------------------------------------------------
import React, { FC } from 'react';
import { Box } from '@chakra-ui/react';

const Footer: FC = () => {

  return (
    <div>
      <Box
        as="footer"
				width="100%"
				height={70}
				mt={41}
				backgroundColor={'#90cdf4'}
        color="White"
				fontSize="30px"
				textAlign="center"
      >
        @Kaname
      </Box>
    </div>
  );
};

export default React.memo(Footer);