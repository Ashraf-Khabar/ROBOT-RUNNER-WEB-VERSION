import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Folder,
  File,
  Upload,
  Download,
  Search,
  FolderOpen,
  FileText,
  Play,
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: string;
  modified?: string;
  path: string;
  children?: FileItem[];
}

interface FileBrowserProps {
  onFileSelect?: (file: FileItem) => void;
  onTestRun?: (file: FileItem) => void;
  className?: string;
}

const defaultFiles: FileItem[] = [
  {
    id: "1",
    name: "test_suites",
    type: "folder",
    path: "/test_suites",
    children: [
      {
        id: "2",
        name: "login_tests.robot",
        type: "file",
        size: "2.4 KB",
        modified: "2024-01-15",
        path: "/test_suites/login_tests.robot",
      },
      {
        id: "3",
        name: "api_tests.robot",
        type: "file",
        size: "3.1 KB",
        modified: "2024-01-14",
        path: "/test_suites/api_tests.robot",
      },
      {
        id: "4",
        name: "ui_tests.robot",
        type: "file",
        size: "4.7 KB",
        modified: "2024-01-13",
        path: "/test_suites/ui_tests.robot",
      },
    ],
  },
  {
    id: "5",
    name: "resources",
    type: "folder",
    path: "/resources",
    children: [
      {
        id: "6",
        name: "keywords.robot",
        type: "file",
        size: "1.8 KB",
        modified: "2024-01-12",
        path: "/resources/keywords.robot",
      },
      {
        id: "7",
        name: "variables.robot",
        type: "file",
        size: "0.9 KB",
        modified: "2024-01-11",
        path: "/resources/variables.robot",
      },
    ],
  },
  {
    id: "8",
    name: "output",
    type: "folder",
    path: "/output",
    children: [
      {
        id: "9",
        name: "log.html",
        type: "file",
        size: "156 KB",
        modified: "2024-01-15",
        path: "/output/log.html",
      },
      {
        id: "10",
        name: "report.html",
        type: "file",
        size: "89 KB",
        modified: "2024-01-15",
        path: "/output/report.html",
      },
      {
        id: "11",
        name: "output.xml",
        type: "file",
        size: "45 KB",
        modified: "2024-01-15",
        path: "/output/output.xml",
      },
    ],
  },
];

const FileBrowser = ({
  onFileSelect = () => {},
  onTestRun = () => {},
  className = "",
}: FileBrowserProps) => {
  const [files] = useState<FileItem[]>(defaultFiles);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["1", "5", "8"]),
  );
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileClick = (file: FileItem) => {
    if (file.type === "folder") {
      toggleFolder(file.id);
    } else {
      setSelectedFile(file.id);
      onFileSelect(file);
    }
  };

  const handleTestRun = (file: FileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onTestRun(file);
  };

  const renderFileTree = (items: FileItem[], level = 0) => {
    return items
      .filter(
        (item) =>
          searchTerm === "" ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .map((item) => (
        <div key={item.id}>
          <div
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
              selectedFile === item.id
                ? "bg-green-100 border border-green-300"
                : ""
            }`}
            style={{ paddingLeft: `${level * 20 + 8}px` }}
            onClick={() => handleFileClick(item)}
          >
            {item.type === "folder" ? (
              expandedFolders.has(item.id) ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500" />
              )
            ) : (
              <FileText className="h-4 w-4 text-gray-500" />
            )}
            <span className="flex-1 text-sm font-medium text-gray-700">
              {item.name}
            </span>
            {item.type === "file" && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">{item.size}</span>
                {item.name.endsWith(".robot") && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleTestRun(item, e)}
                    className="h-6 w-6 p-0 hover:bg-green-100"
                  >
                    <Play className="h-3 w-3 text-green-600" />
                  </Button>
                )}
              </div>
            )}
          </div>
          {item.type === "folder" &&
            expandedFolders.has(item.id) &&
            item.children &&
            renderFileTree(item.children, level + 1)}
        </div>
      ));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Handle file drop logic here
    console.log("Files dropped:", e.dataTransfer.files);
  };

  return (
    <Card
      className={`${className} ${dragOver ? "border-green-400 bg-green-50" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            File Browser
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Upload className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          className="h-80 border-2 border-dashed border-transparent transition-colors"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <ScrollArea className="h-full px-4">
            <div className="space-y-1 pb-4">{renderFileTree(files)}</div>
          </ScrollArea>
        </div>
        {dragOver && (
          <div className="absolute inset-0 bg-green-100/80 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <Upload className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-700 font-medium">Drop test files here</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileBrowser;
