import React from "react";
import CommonModal from "./CommonModal";
import { useFileManager } from "../context/FileManagerContext";

interface DelItemModalProps {
  isVisible: boolean;
  onClose: () => void;
  toDeleteItemId?: string;
  itemName?: string;
}

const DelItemModal: React.FC<DelItemModalProps> = ({ isVisible, onClose, toDeleteItemId, itemName }) => {
  const { labels, onDelete } = useFileManager();

  const onConfirm = async () => {
    if (onDelete) {
      if (!toDeleteItemId) {
        throw new Error("No item to delete");
      }
      try {
        await onDelete(toDeleteItemId);
        onClose();
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  return (
    <CommonModal
      title={`${labels.deleteTitle} ${itemName || ""}?`}
      isVisible={isVisible}
      onClose={onClose}
    >
      <div>
        <form className="rfm-new-folder-modal-form" onSubmit={(e) => e.preventDefault()}>
          <button
            onClick={onConfirm}
            type="button"
            className="rfm-new-folder-modal-btn rfm-upload-file-modal-btn-cancel"
          >
            {labels.deleteConfirm}
          </button>
        </form>
      </div>
    </CommonModal>
  );
};

export default DelItemModal;