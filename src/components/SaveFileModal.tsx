import React, { useRef, useState } from "react";
import CommonModal from "./CommonModal";
import { useFileManager } from "../context/FileManagerContext";

interface SaveFileModalProps {
  isVisible: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

function getFullName(name: string, ext?: string){
  return `${name}${ext||''}`;
}

const SaveFileModal: React.FC<SaveFileModalProps> = ({ isVisible, onClose, onSuccess }) => {
  const { 
    labels, 
    onSaveFile, 
    fileNameDefault, 
    fileSavingExt } = useFileManager();
  const [fileName, setFileName] = useState(fileNameDefault || '');
  const fileNameRef = useRef<HTMLInputElement>(null);

  const onConfirm = async () => {
    const fileName = fileNameRef.current?.value;
    if (fileName && onSaveFile) {
      try {
        const success = await onSaveFile(fileName, fileNameRef.current);
        if (success) {
          onSuccess();
          onClose();
        }
      } catch (error) {
        console.error("Error creating folder:", error);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    if (fileSavingExt && input.endsWith(fileSavingExt)) {
      setFileName(input.slice(0, -fileSavingExt.length));
    } else {
      setFileName(input);
    }
  };

  const handleSelection = (
    event: React.MouseEvent<HTMLInputElement> | React.SyntheticEvent<HTMLInputElement, Event>
  ) => {
    const input = event.currentTarget;
    const extensionStart = fileName.length;

    if (input.selectionStart && input.selectionStart > extensionStart) {
      input.setSelectionRange(extensionStart, extensionStart);
    }
    if (input.selectionEnd && input.selectionEnd > extensionStart) {
      input.setSelectionRange(input.selectionStart || extensionStart, extensionStart);
    }
  };

  return (
    <CommonModal title={ labels.saveFileTitle } isVisible={ isVisible } onClose={ onClose } >
      <div>
        <form className="rfm-new-folder-modal-form" onSubmit= {(e) => e.preventDefault() } >
          <div>
            <input
              ref={fileNameRef}
              type="text"
              className="rfm-new-folder-modal-input"
              value={ getFullName(fileName, fileSavingExt) }
              placeholder={ labels.fileNamePlaceholder }
              required
              autoFocus
              onChange={ handleChange }
              onClick={ handleSelection }
              onFocus={ handleSelection }
              onSelect={ handleSelection }
            />
          </div>
          <button
            onClick={ onConfirm }
            type="button"
            className="rfm-new-folder-modal-btn"
            disabled={ fileName.length===0 }
          >
            { labels.saveFileConfirm }
          </button>
        </form>
      </div>
    </CommonModal>
  );
};

export default SaveFileModal;