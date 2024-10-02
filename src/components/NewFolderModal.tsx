import React, { useRef, useState } from "react";
import CommonModal from "./CommonModal";
import { useFileManager } from "../context/FileManagerContext";

interface NewFolderModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const NewFolderModal: React.FC<NewFolderModalProps> = ({ isVisible, onClose }) => {
  const { labels, onCreateFolder } = useFileManager();
  const [folderNameLength, setFolderNameLength] = useState(0);
  const folderNameRef = useRef<HTMLInputElement>(null);

  const onConfirm = async () => {
    const folderName = folderNameRef.current?.value;
    if (folderName && folderName.length > 0 && onCreateFolder) {
      try {
        await onCreateFolder(folderName, folderNameRef.current) && onClose();
      } catch (error) {
        console.error("Error creating folder:", error);
      }
    }
  };

  return (
    <CommonModal title={labels.addFolderTitle} isVisible={isVisible} onClose={onClose}>
      <div>
        <form className="rfm-new-folder-modal-form" onSubmit={(e) => e.preventDefault()}>
          <div>
            <input
              ref={folderNameRef}
              type="text"
              className="rfm-new-folder-modal-input"
              placeholder={labels.addFolderPlaceholder}
              required
              autoFocus
              onChange={(event)=>setFolderNameLength(event.target.value.length)}
            />
          </div>
          <button
            onClick={onConfirm}
            type="button"
            className="rfm-new-folder-modal-btn"
            disabled={folderNameLength===0}
          >
            {labels.addFolderConfirm}
          </button>
        </form>
      </div>
    </CommonModal>
  );
};

export default NewFolderModal;