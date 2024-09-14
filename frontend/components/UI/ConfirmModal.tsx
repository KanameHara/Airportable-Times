import React, { FC } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
	onConfirm: () => void;
	mainText: string;
	confirmText: string;
}

const ConfirmModal: FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, mainText, confirmText }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
				<ModalHeader>{mainText}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {confirmText}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onConfirm}>
            はい
          </Button>
          <Button variant="ghost" onClick={onClose}>
            いいえ
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(ConfirmModal);
