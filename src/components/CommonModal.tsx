import React from "react";
import Draggable from "react-draggable";
import SvgIcon from "./SvgIcon";

interface CommonModalProps {
  children: React.ReactNode;
  title: string;
  isVisible: boolean;
  onClose: () => void;
}

const CommonModal: React.FC<CommonModalProps> = ({
  children,
  title,
  isVisible,
  onClose,
}) => {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  if (!isVisible) {
    return null;
  }
  return (
    <Draggable nodeRef={ nodeRef } bounds="#react-file-manager-workspace">
      <div ref={nodeRef} className="rfm-modal-container">
        <div className="rfm-modal-header">
          <h3 className="rfm-modal-title">{title}</h3>
          <SvgIcon
            onClick={onClose}
            svgType="close"
            className="rfm-modal-icon"
          />
        </div>
        <div className="rfm-modal-content">{children}</div>
      </div>
    </Draggable>
  );
};

export default CommonModal;