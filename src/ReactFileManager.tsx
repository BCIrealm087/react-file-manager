import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Workspace from "./components/Workspace";
import { ViewStyle } from "./types/Enums";
import { FileType, Labels } from "./types/Types";
import { FileManagerContext } from "./context/FileManagerContext";

interface IFileManagerProps {
  fs: FileType[];
  viewOnly?: boolean;
  isSavingFile?: boolean;
  fileNameDefault?: string;
  fileSavingExt?: string;
  onDoubleClick?: (id: string) => void;
  onRefresh?: (id: string) => Promise<void>;
  onUpload?: (file: File, folderId: string, triggerRef: HTMLButtonElement) => Promise<boolean>;
  onCreateFolder?: (name: string, triggerRef: HTMLInputElement) => Promise<boolean>;
  onPasteItem?: (itemId: string, newParentId: string, triggerRef: HTMLButtonElement) => Promise<boolean>;
  onSaveFile?: (name: string, triggerRef: HTMLInputElement) => Promise<boolean>;
  onDelete?: (id: string) => void;
  onRename?: (id: string, newName: string, triggerRef: HTMLInputElement) => Promise<boolean>;
  labels?: Partial<Labels>;
}

const ReactFileManager: React.FC<IFileManagerProps> = (props) => {
  const [currentFolder, setCurrentFolder] = useState<string>("0");
  const [uploadedFileData, setUploadedFileData] = useState<File | undefined>();
  const [viewStyle, setViewStyle] = useState<ViewStyle>(ViewStyle.List);

  const defaultLabels: Labels = {
    fileName: 'Name',
    lastModified: 'Last Modified',
    addFolderButton: 'Add Folder',
    addFolderTitle: 'Create New Folder',
    addFolderPlaceholder: 'Folder Name',
    addFolderConfirm: 'Create',
    pasteItemButton: 'Paste cut item', 
    cutButton: 'Cut', 
    undoCutItem: 'Undo cut item', 
    saveFileButton: 'Save', 
    saveFileTitle: 'Save',
    fileNamePlaceholder: 'File Name',
    saveFileConfirm: 'Save file', 
    manageTitle: 'Managing',
    renameButton: 'Rename',
    renameTitle: 'Rename',
    renameConfirm: 'Rename',
    deleteButton: 'Delete',
    deleteTitle: 'Delete',
    deleteConfirm: 'Delete', 
    uploadTitle: 'Upload file',
    uploadConfirmationMsg: 'Are you sure you want to upload the file?',
    uploadConfirm: 'Upload',
    cancel: 'Cancel',
  } as const;

  const chosenLabels = { ...defaultLabels, ...props.labels };

  return (
    <FileManagerContext.Provider
      value={ {
      ...props, 
      labels: chosenLabels,
      viewStyle,
      setViewStyle,
      currentFolder,
      setCurrentFolder,
      uploadedFileData,
      setUploadedFileData
      } }
    >
      <div className="rfm-main-container">
        <Navbar />
        <Workspace />
      </div>
    </FileManagerContext.Provider>
  );
};

export { ReactFileManager };
export type { IFileManagerProps };