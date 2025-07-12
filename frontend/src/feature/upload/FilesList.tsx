import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  DocumentTextIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";
import { chatService } from "../../services";
import { FilesResponse } from "../../types/api";
import { formatTime } from "../../util/dateUtils";

interface FilesListProps {
  onError?: (error: string) => void;
  refreshTrigger?: number;
}

export default function FilesList({ onError, refreshTrigger }: FilesListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<FilesResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const response = await chatService.getFiles();
      setFiles(response);
    } catch (error) {
      console.error("Failed to load files:", error);
      onError?.(
        error instanceof Error ? error.message : "Failed to load files",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadFiles();
    }
  }, [isOpen, refreshTrigger]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTotalSize = (totalBytes: number): string => {
    return formatFileSize(totalBytes);
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="text-text-secondary hover:text-text-primary h-10 w-full justify-start gap-3 rounded-md px-3 hover:bg-neutral-200"
      >
        <FolderOpenIcon className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm">View Files</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 flex max-h-[80vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h2 className="text-text-primary text-lg font-semibold">
                  Uploaded Files
                </h2>
                {files && (
                  <p className="text-text-secondary text-sm">
                    {files.total_files} file{files.total_files !== 1 ? "s" : ""}{" "}
                    · {formatTotalSize(files.total_size_bytes)}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-text-secondary">Loading files...</div>
                </div>
              ) : files && files.files.length > 0 ? (
                <div className="space-y-2">
                  {files.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <DocumentTextIcon className="h-5 w-5 flex-shrink-0 text-red-500" />
                        <div className="min-w-0 flex-1">
                          <p className="text-text-primary truncate text-sm font-medium">
                            {file.filename}
                          </p>
                          <div className="text-text-secondary flex items-center gap-4 text-xs">
                            <span>{formatFileSize(file.size)}</span>
                            <span>Uploaded {formatTime(file.upload_time)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FolderOpenIcon className="mb-4 h-12 w-12 text-gray-400" />
                  <p className="text-text-secondary text-lg font-medium">
                    No files uploaded yet
                  </p>
                  <p className="text-text-tertiary mt-1 text-sm">
                    Upload PDF files for document analysis
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
