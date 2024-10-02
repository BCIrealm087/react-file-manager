import React from "react";

interface NewFolderIconProps {
  onClick: () => void;
}

const NewFolderIcon: React.FC<NewFolderIconProps> = ({ onClick }) => {
  return (
    <div onClick={onClick} className="rfm-folder-icon-container">
      <span className="rfm-folder-icon-span">+</span>
    </div>
  );
};

export default NewFolderIcon;