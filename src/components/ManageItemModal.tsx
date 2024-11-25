import React from "react";
import CommonModal from "./CommonModal";
import { useFileManager } from "../context/FileManagerContext";

interface ManageItemModalProps {
  isVisible: boolean;
  onClose: () => void;
  itemName?: string;
  openRename: () => void;
  cutItem: () => void;
  openDelete: () => void;
}

const ManageItemModal: React.FC<ManageItemModalProps> = ({
  isVisible,
  onClose,
  itemName,
  openRename,
  cutItem, 
  openDelete
}) => {
  const { labels } = useFileManager();

  return (
    <CommonModal
      title={`${labels.manageTitle} ${itemName || ""}`}
      isVisible={isVisible}
      onClose={onClose}
    >
      <div>
        <form className="rfm-new-folder-modal-form" onSubmit={(e) => e.preventDefault()}>
          <button
            onClick={() => {
              openRename();
              onClose();
            }}
            type="button"
            className="rfm-new-folder-modal-btn"
          >
            {labels.renameButton}
          </button>
          <button
            onClick={() => {
              cutItem();
              onClose();
            }}
            type="button"
            className="rfm-new-folder-modal-btn"
          >
            { labels.cutButton }
          </button>
          <button
            onClick={() => {
              openDelete();
              onClose();
            }}
            type="button"
            className="rfm-new-folder-modal-btn rfm-upload-file-modal-btn-cancel"
          >
            {labels.deleteButton}
          </button>
        </form>
      </div>
    </CommonModal>
  );
};

export default ManageItemModal;