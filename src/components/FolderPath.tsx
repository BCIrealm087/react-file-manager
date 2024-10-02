import React, { useMemo } from "react";
import SvgIcon from "./SvgIcon";
import { useFileManager } from "../context/FileManagerContext";


interface File {
  id: string;
  name: string;
  isDir: boolean;
  parentId?: string;
  path?: string;
  lastModified?: number;
}

enum ViewStyle {
  List = "list",
  Icons = "icons",
}

const FolderPath: React.FC = () => {
  const {
    fs,
    currentFolder,
    setCurrentFolder,
    onRefresh,
    viewStyle,
    setViewStyle,
  } = useFileManager();

  const goUp = () => {
    const currentFolderInfo = fs.find((f: File) => f.id === currentFolder);
    if (currentFolderInfo && 'parentId' in currentFolderInfo && currentFolderInfo.parentId) {
      setCurrentFolder(currentFolderInfo.parentId);
      if (onRefresh !== void 0) {
        onRefresh(currentFolderInfo.parentId).catch(() => {
          throw new Error("Error during refresh");
        });
      }
    }
  };

  const parentPath = useMemo(() => {
    const folder = fs.find((f: File) => f.id === currentFolder);
    if (!folder || !('parentId' in folder)) {
      return "";
    }
    const parentId = folder.parentId;
    if (!parentId) {
      return "";
    }
    const parentDir = fs.find((f: File) => f.id === parentId);
    if (!parentDir?.path) {
      return "";
    }
    const _parentPath =
      parentDir.path.slice(-1) === "/" ? parentDir.path : `${parentDir.path}/`;
    return _parentPath;
  }, [fs, currentFolder]);

  const currentPath = useMemo(() => {
    const currentFolderInfo = fs.find((f: File) => f.id === currentFolder);
    return currentFolderInfo ? currentFolderInfo.name : "";
  }, [fs, currentFolder]);

  return (
    <div className="rfm-workspace-header">
      <div className="rfm-folder-path-container">
        <SvgIcon
          svgType="arrow-up"
          onClick={goUp}
          className="rfm-folder-path-svg"
        />
        <span className="rfm-folder-path-span">
          {parentPath}
          <b>{currentPath}</b>
        </span>
      </div>
      <div className="rfm-header-container">
        <SvgIcon
          svgType="list"
          className={`rfm-header-icon ${
            viewStyle === "list" && "rfm-header-icon--selected"
          }`}
          onClick={() => setViewStyle(ViewStyle.List)}
        />
        <SvgIcon
          svgType="icons"
          className={`rfm-header-icon ${
            viewStyle === "icons" && "rfm-header-icon--selected"
          }`}
          onClick={() => setViewStyle(ViewStyle.Icons)}
        />
      </div>
    </div>
  );
};

export default FolderPath;