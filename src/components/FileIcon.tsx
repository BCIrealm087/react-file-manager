import React, { useMemo } from "react";
import { useFileManager } from "../context/FileManagerContext";
import SvgIcon from "./SvgIcon";

interface FileIconProps {
  id: string;
  name: string;
  isDir: boolean;
  isCutItem: boolean;
  handleContextMenu: (event: React.MouseEvent, fileId: string, fileName: string) => void;
}

const FileIcon: React.FC<FileIconProps> = ({ id, name, isDir, isCutItem, handleContextMenu }) => {
  const { setCurrentFolder, onRefresh } = useFileManager();

  const handleClick = async () => {
    if(isCutItem) return;
    if (isDir) {
      setCurrentFolder(id);
      if (onRefresh) {
        try {
          await onRefresh(id);
        } catch (e) {
          console.error("Error during refresh", e);
        }
      }
    }
  };

  const fileExtension = useMemo(() => {
    if (!name.includes(".")) {
      return "";
    }
    const nameArray = name.split(".");
    return `.${nameArray[nameArray.length - 1]}`;
  }, [name]);

  return (
    <div
      onClick={handleClick}
      onContextMenu={(event) => handleContextMenu(event, id, name)}
      className="rfm-file-icon-container"
    >
      <SvgIcon svgType={isDir ? "folder" : "file"} className="rfm-file-icon-svg" />
      {!isDir && <span className="rfm-file-icon-extension">{fileExtension}</span>}
      <span className="rfm-file-icon-name">{name}</span>
    </div>
  );
};

export default FileIcon;