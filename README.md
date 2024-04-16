# React File Manager


`react-file-manager` is a comprehensive UI library for React that enables developers to quickly integrate a file management system into their web applications. This package provides a set of graphical components along with a suite of callback functions to handle various file actions such as refreshing, uploading, creating folders, and deleting files.

## Features

- **Customizable UI**: Easy to integrate with existing projects and modify according to the theme of your application.
- **Event Handling**: Built-in support for essential file management operations including refresh, upload, create folder, and delete.
- **React Optimized**: Utilizes React's latest features for optimal performance and compatibility.

## Installation

Install `react-file-manager` using npm:

```bash
npm install @thelicato/react-file-manager
```

## Usage

Here's a quick example to get you started:

```javascript
import React from "react";
import type { FileSystemType } from "@thelicato/react-file-manager";
import { ReactFileManager } from "@thelicato/react-file-manager";

export const dummyFileSystem: FileSystemType = [
  { id: "0", name: "/", path: "/", isDir: true },
  {
    id: "31258",
    name: "report.pdf",
    isDir: false,
    parentId: "0",
  },
  {
    id: "31259",
    name: "Documents",
    isDir: true,
    parentId: "0",
    path: "/Documents",
  },
  {
    id: "31261",
    name: "Personal",
    isDir: true,
    parentId: "31259",
    path: "/Documents/Personal",
  },
  {
    id: "31260",
    name: "report.docx",
    isDir: false,
    parentId: "0",
  },
  {
    id: "31267",
    name: "Images",
    isDir: true,
    parentId: "0",
    path: "/Images",
  },
  {
    id: "31260",
    name: "logo.png",
    isDir: false,
    parentId: "31267",
  },
];

function App() {
  return (
    <div className="container">
      <ReactFileManager fs={dummyFileSystem} />
    </div>
  );
}

export default App;
```

This example provide a dummy filesystem, of course you can also map a real file system as long as you create an array of ``FileSystemType``.

## License

[MIT](./LICENSE) License © [Angelo Delicato](https://github.com/thelicato)