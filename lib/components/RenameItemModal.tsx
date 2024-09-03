import React, { useRef, useState } from "react";
import CommonModal from "./CommonModal";
import { useFileManager } from "../context/FileManagerContext";

interface RenameItemModalProps {
  isVisible: boolean;
  onClose: () => void;
  toRenameItemId?: string;
  itemName?: string;
}

const RenameItemModal: React.FC<RenameItemModalProps> = ({
  isVisible,
  onClose,
  toRenameItemId,
  itemName,
}) => {
  const { labels, onRename } = useFileManager();
  const [itemNameLength, setItemNameLength] = useState(0);
  const itemNameRef = useRef<HTMLInputElement>(null);

  const onConfirm = async () => {
    const newItemName = itemNameRef.current?.value;
    if (!toRenameItemId) {
      throw new Error("No item to rename");
    }
    if (newItemName && newItemName.length > 0 && onRename) {
      try {
        await onRename(toRenameItemId, newItemName, itemNameRef.current);
        onClose();
      } catch (error) {
        console.error("Error renaming item:", error);
      }
    }
  };

  return (
    <CommonModal
      title={`${labels.renameTitle} ${itemName || ""}?`}
      isVisible={isVisible}
      onClose={onClose}
    >
      <div>
        <form className="rfm-new-folder-modal-form" onSubmit={(e) => e.preventDefault()}>
          <div>
            <input
              ref={itemNameRef}
              type="text"
              className="rfm-new-folder-modal-input"
              placeholder={itemName}
              required
              autoFocus
              onChange={(event)=>setItemNameLength(event.target.value.length)}
            />
          </div>
          <button
            onClick={onConfirm}
            type="button"
            className="rfm-new-folder-modal-btn"
            disabled={itemNameLength===0}
          >
            {labels.renameConfirm}
          </button>
        </form>
      </div>
    </CommonModal>
  );
};

export default RenameItemModal;