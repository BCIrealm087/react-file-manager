import React from "react";

import { useFileManager } from "../context/FileManagerContext";
import { ShortFileInfo } from "../types/Types";

const CutItemOptions = (
  { 
    cutItem, 
    handleClose
  } 
  : 
  { 
    cutItem: ShortFileInfo, 
    handleClose: ()=>void
  }
) => {
  const { currentFolder, onPasteItem, labels } = useFileManager();
  return (
    <div className="rfm-cut-item-options">
      <button className="rfm-workspace-list-add-folder rfm-cut-item-options-button" onClick={ 
        async (event)=>onPasteItem && 
          await onPasteItem(cutItem.id, currentFolder, event.currentTarget) && handleClose() 
      }>
        <span>{ labels.pasteItemButton }</span> <span><b>{ ` (${cutItem.name})` }</b></span>
      </button>
      <button className="rfm-workspace-list-add-folder rfm-cut-item-options-button" onClick={ 
        handleClose 
      }>
        { labels.undoCutItem }
      </button>
    </div>
  )
}

export default CutItemOptions;