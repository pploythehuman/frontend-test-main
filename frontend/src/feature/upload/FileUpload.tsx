import React, { useState, useRef, useCallback } from "react";
import { Button } from "../../components/ui/button";
import {
  DocumentPlusIcon,
  DocumentTextIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { chatService } from "../../services";
import { FilesResponse } from "../../types/api";

interface FileUploadProps {
  onUploadComplete?: (files: FilesResponse) => void;
  onUploadError?: (error: string) => void;
}

interface FileItem {
  file: File;
  id: string;
  status: "pending" | "uploading" | "uploaded" | "error";
  error?: string;
}

export default function FileUpload({
  onUploadComplete,
  onUploadError,
}: FileUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelection(droppedFiles);
  }, []);

  const handleFileSelection = (selectedFiles: File[]) => {
    const pdfFiles = selectedFiles.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf"),
    );

    if (pdfFiles.length !== selectedFiles.length) {
      const nonPdfCount = selectedFiles.length - pdfFiles.length;
      onUploadError?.(
        `${nonPdfCount} non-PDF files were ignored. Only PDF files are supported.`,
      );
    }

    const newFiles: FileItem[] = pdfFiles.map((file) => ({
      file,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      status: "pending",
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelection(Array.from(e.target.files));
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const fileList = new DataTransfer();
      files.forEach((fileItem) => fileList.items.add(fileItem.file));

      const response = await chatService.uploadFiles(fileList.files);

      setFiles((prev) =>
        prev.map((file) => ({ ...file, status: "uploaded" as const })),
      );

      const updatedFiles = await chatService.getFiles();
      onUploadComplete?.(updatedFiles);

      setTimeout(() => {
        setIsOpen(false);
        setFiles([]);
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      onUploadError?.(errorMessage);

      setFiles((prev) =>
        prev.map((file) => ({
          ...file,
          status: "error" as const,
          error: errorMessage,
        })),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="text-text-secondary hover:text-text-primary h-10 w-full justify-start gap-3 rounded-md px-3 hover:bg-neutral-200"
      >
        <DocumentPlusIcon className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm text-text-secondary">Upload PDFs</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-text-secondary text-lg font-semibold">
                Upload PDF Files
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4">
              <div
                className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-neutral-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Drag and drop PDF files here, or{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-500"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      browse
                    </button>
                  </p>
                  <p className="mt-1 text-xs text-gray-500">PDF files only</p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,application/pdf"
                onChange={handleFileInput}
                className="hidden"
              />

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-text-primary text-sm font-medium">
                    Selected Files ({files.length})
                  </h3>
                  <div className="max-h-32 space-y-1 overflow-y-auto">
                    {files.map((fileItem) => (
                      <div
                        key={fileItem.id}
                        className="flex items-center justify-between rounded bg-gray-50 p-2"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <DocumentTextIcon className="h-4 w-4 flex-shrink-0 text-red-500" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm">
                              {fileItem.file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(fileItem.file.size)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {fileItem.status === "uploaded" && (
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          )}
                          {fileItem.status === "error" && (
                            <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                          )}
                          {fileItem.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(fileItem.id)}
                              className="h-6 w-6 p-0"
                            >
                              <XMarkIcon className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t p-4">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={uploadFiles}
                disabled={files.length === 0 || isUploading}
              >
                {isUploading
                  ? "Uploading..."
                  : `Upload ${files.length} file${files.length !== 1 ? "s" : ""}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
