import React, { useCallback, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
  Chip,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  CheckCircle,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  success?: boolean;
  progress?: number;
  selectedFile?: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  accept = {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  disabled = false,
  loading = false,
  error,
  success = false,
  progress = 0,
  selectedFile,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
    disabled: disabled || loading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileType = (file: File) => {
    if (file.type.startsWith("image/")) return "Image";
    if (file.type === "application/pdf") return "PDF";
    return "Document";
  };

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          border: "2px dashed",
          borderColor: dragActive
            ? "primary.main"
            : error
            ? "error.main"
            : success
            ? "success.main"
            : "grey.300",
          backgroundColor: dragActive
            ? "primary.50"
            : error
            ? "error.50"
            : success
            ? "success.50"
            : "grey.50",
          cursor: disabled || loading ? "not-allowed" : "pointer",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            borderColor: disabled || loading ? "grey.300" : "primary.main",
            backgroundColor: disabled || loading ? "grey.50" : "primary.50",
          },
        }}
      >
        <input {...getInputProps()} />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
        >
          <CloudUpload
            sx={{
              fontSize: 48,
              color: dragActive
                ? "primary.main"
                : error
                ? "error.main"
                : success
                ? "success.main"
                : "grey.400",
              mb: 2,
            }}
          />
          <Typography variant="h6" gutterBottom>
            {isDragActive
              ? "Drop the file here"
              : selectedFile
              ? "File selected"
              : "Drag & drop a file here"}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            or click to select a file
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Supported formats: PDF, JPG, PNG (Max {formatFileSize(maxSize)})
          </Typography>
        </Box>
      </Paper>

      {selectedFile && (
        <Box mt={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={2}
            bgcolor="grey.100"
            borderRadius={1}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={getFileType(selectedFile)}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Typography variant="body2" fontWeight="medium">
                {selectedFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({formatFileSize(selectedFile.size)})
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              {success && <CheckCircle color="success" />}
              {error && <ErrorIcon color="error" />}
              {onFileRemove && (
                <IconButton
                  size="small"
                  onClick={onFileRemove}
                  disabled={loading}
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {loading && (
        <Box mt={2}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="body2" color="text.secondary">
              Uploading...
            </Typography>
            <Typography variant="body2" color="primary.main">
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {success && !loading && (
        <Alert severity="success" sx={{ mt: 2 }}>
          File uploaded successfully!
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload;
