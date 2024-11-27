import React, { 
  useState, useMemo, useCallback, 
  useEffect 
} from "react";
import { useDropzone } from "react-dropzone";
import { useFileManager } from "../context/FileManagerContext";
import FileIcon from "./FileIcon"
import NewFolderIcon from "./NewFolderIcon";
import FolderPath from "./FolderPath";
import NewFolderModal from "./NewFolderModal";
import SaveFileModal from "./SaveFileModal";
import DelItemModal from "./DelItemModal";
import RenameItemModal from "./RenameItemModal";
import ManageItemModal from "./ManageItemModal";
import UploadFileModal from "./UploadFileModal";
import CutItemOptions from "./CutItemOptions";
import SvgIcon from "./SvgIcon"
import { 
  createColumnHelper, flexRender, getCoreRowModel, 
  getSortedRowModel, useReactTable 
} from "@tanstack/react-table";
import { FileType, ShortFileInfo } from "../types/Types";

const columnHelper = createColumnHelper<FileType>();
const columns = [
  columnHelper.accessor("name", {
    header: () => "Name",
    cell: (info) => (
      <div className="rfm-workspace-list-icon-td">
        <SvgIcon svgType={info.row.original.isDir ? "folder" : "file"} className="rfm-workspace-list-icon" />
        <p>{info.getValue()}</p>
      </div>
    )
  }),
  columnHelper.accessor("lastModified", {
    header: () => "Last Modified",
    cell: (info) => {
      const value = info.getValue();
      return (value) ? new Date(value).toLocaleString() : "N/A";
    }
  })
];

const Workspace: React.FC = () => {
  const {
    labels,
    currentFolder,
    fs,
    viewStyle, 
    isSavingFile: isSavingFileInitial, 
    viewOnly,
    setCurrentFolder,
    setUploadedFileData, 
    onDoubleClick,
    onRefresh
  } = useFileManager();
  
  const [newFolderModalVisible, setNewFolderModalVisible] = useState(false);
  const [saveFileModalVisible, setSaveFileModalVisible] = useState(false);
  const [toDeleteItem, setToDeleteItem] = useState<ShortFileInfo | null>(null);
  const [toRenameItem, setToRenameItem] = useState<ShortFileInfo | null>(null);
  const [cutItem, setCutItem] = useState<ShortFileInfo | null>(null);
  const [isSavingFile, setIsSavingFile] = useState(isSavingFileInitial);
  const [uploadFileModalVisible, setUploadFileModalVisible] = useState(false);
  const [toManageItem, setToManageItem] = useState<ShortFileInfo | null>(null);

  const setUploadModalVisible = (value: boolean) => {
    if (viewOnly) {
      setUploadFileModalVisible(false);
    } else {
      setUploadFileModalVisible(value);
    }
  };

  useEffect(() => {
    if (newFolderModalVisible) {
      setNewFolderModalVisible(false);
    }
    if (saveFileModalVisible) {
      setSaveFileModalVisible(false);
    }
    if (toDeleteItem) {
      setToDeleteItem(null);
    }
    if (toRenameItem) {
      setToRenameItem(null);
    }
    if (toManageItem) {
      setToManageItem(null);
    }
    if (uploadFileModalVisible) {
      setUploadModalVisible(false);
      setUploadedFileData(undefined);
    }
  }, [currentFolder]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setUploadedFileData(file);
      setUploadModalVisible(true);
    },
    [setUploadedFileData]
  );

  const onCloseUploadFileModal = () => {
    setUploadModalVisible(false);
    setUploadedFileData(undefined);
  };

  const { getRootProps, isDragAccept } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  const currentFolderFiles = useMemo(() => {
    const files = fs.filter((f) => 'parentId' in f && f.parentId === currentFolder);
    return files;
  }, [fs, currentFolder]);

  const table = useReactTable<FileType>({
    data: currentFolderFiles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: "name", desc: false }]
    }
  });

  const handleClick = async (file: FileType) => {
    if(file.id===cutItem?.id) return;
    if (file.isDir) {
      setCurrentFolder(file.id);
      if (onRefresh) {
        try {
          await onRefresh(file.id);
        } catch (e) {
          console.error("Error during refresh", e);
        }
      }
    }
  };

  const handleDoubleClick = (id: string) => {
    if (onDoubleClick) {
      onDoubleClick(id);
    }
  };

  const openNewFolderModal = () => {
    setNewFolderModalVisible(true);
    setToManageItem(null);
    setToDeleteItem(null);
    setToRenameItem(null);
  };

  const openSaveFileModal = () => {
    setSaveFileModalVisible(true);
    setNewFolderModalVisible(false);
    setToManageItem(null);
    setToDeleteItem(null);
    setToRenameItem(null);
  };

  const openManageItemModal = (item: ShortFileInfo) => {
    if (item.id===cutItem?.id) return;
    setToManageItem(item);
    setNewFolderModalVisible(false);
    setSaveFileModalVisible(false);
  };

  const openDeleteItemModal = (item: ShortFileInfo) => {
    setToDeleteItem(item);
    setNewFolderModalVisible(false);
    setSaveFileModalVisible(false);
  };

  const openRenameItemModal = (item: ShortFileInfo) => {
    setToRenameItem(item);
    setNewFolderModalVisible(false);
    setSaveFileModalVisible(false);
  };

  const handleContextMenu = (event: React.MouseEvent, fileId: string, fileName: string) => {
    event.preventDefault();
    setNewFolderModalVisible(false);
    setSaveFileModalVisible(false);
    openManageItemModal({ id: fileId, name: fileName });
  };

  return (
    <div className="rfm-workspace">
      <section
        id="react-file-manager-workspace"
        className={`rfm-workspace ${isDragAccept && !viewOnly ? "rfm-workspace-dropzone" : ""}`}
        {...getRootProps()}
      >
        <FolderPath />
        <div className="rfm-workspace-file-listing">
          {viewStyle === "icons" && (
            <>
              {currentFolderFiles.map((f) => (
                <button className={ (f.id===cutItem?.id) ? 'rfm-cut-item' : '' } key={f.id} onDoubleClick={() => handleDoubleClick(f.id)}>
                  <FileIcon 
                    id={f.id} 
                    name={f.name} 
                    isDir={f.isDir} 
                    isCutItem={ f.id===cutItem?.id }
                    handleContextMenu={ handleContextMenu } 
                  />
                </button>
              ))}
              {!viewOnly && (
                <>
                  <NewFolderIcon onClick={ openNewFolderModal } />
                  { isSavingFile && <button className="rfm-workspace-list-add-folder" onClick={ openSaveFileModal } >
                      { labels.saveFileButton }
                  </button> }
                  { cutItem && <CutItemOptions
                    cutItem={ cutItem }
                    handleClose={ ()=>setCutItem(null) }
                  /> }
                </>
              )}
            </>
          )}
          {viewStyle === "list" && (
            <>
              <table className="w-full">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="rfm-workspace-list-th" onClick={header.column.getToggleSortingHandler()}>
                          <div className="rfm-workspace-list-th-content">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted()
                              ? header.column.getIsSorted() === "desc"
                                ? <SvgIcon svgType="arrow-down" className="rfm-header-sort-icon" />
                                : <SvgIcon svgType="arrow-up" className="rfm-header-sort-icon" />
                              : ""}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="rfm-workspace-list-icon-row">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={`rfm-workspace-list-align-txt${(row.original.id===cutItem?.id) ? ' rfm-cut-item' : '' }`}
                          onClick={() => handleClick(row.original)}
                          onContextMenu={(event) => handleContextMenu(event, row.original.id, row.original.name)}
                          onDoubleClick={() => handleDoubleClick(row.original.id)}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {!viewOnly && (
                <React.Fragment>
                  { (isSavingFile)
                    ? <div className="rfm-cut-item-options">
                        <button 
                          className="rfm-workspace-list-add-folder rfm-cut-item-options-button" 
                          onClick={ openNewFolderModal }
                        >
                          { labels.addFolderButton }
                        </button>
                        <button 
                          className="rfm-workspace-list-add-folder rfm-cut-item-options-button" 
                          onClick={ openSaveFileModal }
                        >
                          { labels.saveFileButton }
                        </button>
                      </div>
                    : <button className="rfm-workspace-list-add-folder" onClick={ openNewFolderModal }>
                        { labels.addFolderButton }
                      </button>

                  }
                  { cutItem && <CutItemOptions
                    cutItem={ cutItem }
                    handleClose={ ()=>setCutItem(null) }
                  /> }
                </React.Fragment>
              )}
            </>
          )}
        </div>
      </section>
      {!viewOnly && (
        <>
          <NewFolderModal
            isVisible={ newFolderModalVisible }
            onClose={ () => setNewFolderModalVisible(false) }
          />
          <SaveFileModal
            isVisible={ saveFileModalVisible }
            onSuccess={ () => setIsSavingFile(false) }
            onClose={ () => setSaveFileModalVisible(false) }
          />
          <DelItemModal
            itemName={toDeleteItem?.name}
            toDeleteItemId={toDeleteItem?.id}
            isVisible={!!toDeleteItem}
            onClose={() => setToDeleteItem(null)}
          />
          <RenameItemModal
            itemName={toRenameItem?.name}
            toRenameItemId={toRenameItem?.id}
            isVisible={!!toRenameItem}
            onClose={() => setToRenameItem(null)}
          />
          <ManageItemModal
            itemName={toManageItem?.name}
            isVisible={!!toManageItem}
            openDelete={() => { 
              if (!toManageItem)
                throw 'No item being managed.'
              openDeleteItemModal(toManageItem)
            } }
            openRename={() => { 
              if (!toManageItem)
                throw 'No item being managed.'
              openRenameItemModal(toManageItem)
            } }
            cutItem={() => {
              if (!toManageItem)
                throw 'No item being managed.'
              setCutItem(toManageItem)
            } }
            onClose={() => setToManageItem(null)}
          />
          <UploadFileModal
            isVisible={uploadFileModalVisible}
            onClose={onCloseUploadFileModal}
          />
        </>
      )}
    </div>
  );
};

export default Workspace;