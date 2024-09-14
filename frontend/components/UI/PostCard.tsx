//----------------------------------------------------------------
// 投稿データ簡易表示カードコンポーネント
//----------------------------------------------------------------
import React, { FC } from 'react';
import { Box, Image, Text } from '@chakra-ui/react';
import { PostInfoType } from "@/types/PostInfoType";

interface PostCardProps {
  post: PostInfoType;
  onClick: (postId: bigint) => void;
}

const PostCard: FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <Box
      key={post.id}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      width="300px"
      height="300px"
      onClick={() => onClick(post.id)}
      cursor="pointer"
    >
      {post.image_urls && post.image_urls.length > 0 ? (
        <Image src={post.image_urls[0]} alt={post.title} objectFit="cover" height="200px" />
      ) : (
        <Box height="200px" display="flex" alignItems="center" justifyContent="center" bg="gray.200">
          <Text>No Image</Text>
        </Box>
      )}
      <Box p="6">
        <Box display="flex" alignItems="baseline">
          <Text fontWeight="bold" as="h4" lineHeight="tight" isTruncated>
            {post.title}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(PostCard);