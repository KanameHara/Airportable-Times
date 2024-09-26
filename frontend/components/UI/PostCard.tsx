//----------------------------------------------------------------
// 投稿データ簡易表示カードコンポーネント
//----------------------------------------------------------------
import React, { FC } from 'react';
import { Card, CardBody, CardFooter, Image, Box, Text, Flex } from '@chakra-ui/react';
import { PostInfoType } from "@/types/PostInfoType";

interface PostCardProps {
  post: PostInfoType;
  onClick: (postId: bigint) => void;
  text: JSX.Element; 
}

const PostCard: FC<PostCardProps> = ({ post, onClick, text }) => {
  return (
    <Card
      key={post.id}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      width="86%"
      height="300px"
      cursor="pointer"
      borderColor="gray.300" 
      onClick={() => onClick(post.id)}
    >
      <CardBody p={0}>
        {post.image_urls && post.image_urls.length > 0 ? (
          <Image
            src={post.image_urls[0]}
            alt={post.title}
            objectFit="cover"
            height="200px"
            width="100%"
          />
        ) : (
          <Box height="200px" display="flex" alignItems="center" justifyContent="center" bg="gray.200">
            <Text>No Image</Text>
          </Box>
        )}
      </CardBody>

      <CardFooter>
        <Flex direction="column">
          <Text fontWeight="bold" isTruncated>
            {post.title}
          </Text>
          {text}
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default React.memo(PostCard);