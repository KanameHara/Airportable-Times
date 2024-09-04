//----------------------------------------------------------------
// カテゴリ選択ドロップダウンメニューのコンポーネント
//----------------------------------------------------------------
import React, { FC } from 'react';
import { Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

interface Category {
  id: bigint;
  name: string;
}

interface CategoryDropdownProps {
  categories: Category[];
  selectedCategory: bigint;
  onSelect: (categoryId: bigint) => void;
}

const CategoryDropdown: FC<CategoryDropdownProps> = ({ categories, selectedCategory, onSelect }) => {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {categories.length > 0 
          ? categories.find(category => category.id === selectedCategory)?.name || 'カテゴリを選択'
          : 'カテゴリを選択'}
      </MenuButton>
      <MenuList>
        {categories.map((category) => (
          <MenuItem key={category.id} onClick={() => onSelect(category.id)}>
            {category.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default React.memo(CategoryDropdown);