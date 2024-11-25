import React from "react";
import CommonModal from "./CommonModal";
import { useFileManager } from "../context/FileManagerContext";

interface UploadFileModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const UploadFileModal: React.FC<UploadFileModalProps> = ({ isVisible, onClose }) => {
  const { labels, onUpload, uploadedFileData, currentFolder } = useFileManager();

  const onConfirm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (onUpload && uploadedFileData) {
      try {
        await onUpload(uploadedFileData, currentFolder, event.currentTarget);
        onClose();
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <CommonModal
      title={labels.uploadTitle}
      isVisible={isVisible}
      onClose={onClose}
    >
      <div>
        <h4 className="rfm-upload-file-modal-title">{labels.uploadConfirmationMsg}</h4>
        <div className="rfm-upload-file-modal-container">
          <button
            onClick={onConfirm}
            type="button"
            className="rfm-upload-file-modal-btn rfm-upload-file-modal-btn-confirm"
          >
            {labels.uploadConfirm}
          </button>
          <button
            onClick={onClose}
            type="button"
            className="rfm-upload-file-modal-btn rfm-upload-file-modal-btn-cancel"
          >
            {labels.cancel}
          </button>
        </div>
      </div>
    </CommonModal>
  );
};

export default UploadFileModal;