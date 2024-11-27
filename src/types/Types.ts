import { ViewStyle } from "./Enums";

export type FileType = {
  id: string;
  name: string;
  isRoot?: false;
  isDir: false;
  path?: string;
  parentId: string;
  lastModified?: number;
} | {
  id: string;
  name: string;
  isRoot?: false;
  isDir: true;
  path: string;
  parentId: string;
  lastModified?: number;
} | {
  id: string;
  name: string;
  isRoot: true;
  isDir: true;
  path: string;
  lastModified?: number;
};

export type ShortFileInfo = {
  id: string, 
  name: string
}

export interface Labels {
  fileName: string;
  lastModified: string;
  addFolderButton: string;
  addFolderTitle: string;
  addFolderPlaceholder: string;
  addFolderConfirm: string;
  pasteItemButton: string;
  cutButton: string;
  undoCutItem: string;
  saveFileButton: string;
  saveFileTitle: string;
  fileNamePlaceholder: string;
  saveFileConfirm: string;
  manageTitle: string;
  renameButton: string;
  renameTitle: string;
  renameConfirm: string;
  deleteButton: string;
  deleteTitle: string;
  deleteConfirm: string;
  uploadTitle: string;
  uploadConfirmationMsg: string;
  uploadConfirm: string;
  cancel: string;
}