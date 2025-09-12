import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Pagination,
} from "@mui/material";
import {
  Add,
  Description,
  Visibility,
  Delete,
  Upload,
  Download,
  Refresh,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../lib/hooks/useAuth";
import documentsApi from "../../services/modules/documents.api";
import { getErrorMessage } from "../../utils/errorHandler";
import { useToast } from "../../contexts/ToastContext";
import FileUpload from "../../components/FileUpload/FileUpload";
import { Document } from "../../types/api";

// Get file URL for preview
const getFileUrl = (documentPath: string) => {
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:7001";
  return `${API_BASE_URL}${documentPath}`;
};

const Documents: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentPurpose, setDocumentPurpose] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [description, setDescription] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    documentName?: string;
    documentPurpose?: string;
    documentType?: string;
  }>({});
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Fetch user documents
  const {
    data: documents = [],
    isLoading,
    error,
  } = useQuery<Document[], Error>({
    queryKey: ["documents"],
    queryFn: documentsApi.getUserDocuments,
    enabled: isAuthenticated,
  });

  // Upload document mutation
  const uploadMutation = useMutation({
    mutationFn: ({
      file,
      name,
      purpose,
      type,
      documentType,
    }: {
      file: File;
      name: string;
      purpose: string;
      type: string;
      documentType?: string;
    }) => documentsApi.uploadDocument(file, name, purpose, type, documentType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setOpenDialog(false);
      setSelectedFile(null);
      setDocumentName("");
      setDocumentPurpose("");
      setDocumentType("");
      setDescription("");
      setValidationErrors({});
    },
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  const validateForm = () => {
    const errors: {
      documentName?: string;
      documentPurpose?: string;
      documentType?: string;
    } = {};

    if (!documentName.trim()) {
      errors.documentName = "Document name is required";
    }
    if (!documentPurpose.trim()) {
      errors.documentPurpose = "Document purpose is required";
    }
    if (!documentType) {
      errors.documentType = "Document type is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpload = () => {
    if (!selectedFile) {
      console.error("Please select a file");
      return;
    }

    if (validateForm()) {
      uploadMutation.mutate({
        file: selectedFile,
        name: documentName,
        purpose: documentPurpose,
        type: documentType,
        documentType: description || undefined,
      });
    }
  };

  const handleDocumentView = (document: Document) => {
    setSelectedDocument(document);
    setDocumentDialogOpen(true);
  };

  const handleDocumentDownload = (document: Document) => {
    documentsApi
      .downloadDocument(document.document_id)
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement("a");
        a.href = url;
        a.download = document.original_name;
        window.document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        window.document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Download failed:", error);
        // Fallback to direct URL
        window.open(
          `/api/documents/${document.document_id}/download`,
          "_blank"
        );
      });
  };

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: string) => documentsApi.deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  const handleDocumentDelete = (document: Document) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${
          document.name || document.original_name
        }"?`
      )
    ) {
      deleteDocumentMutation.mutate(document.document_id);
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["documents"] });
  };

  // Pagination helper functions
  const getPaginatedData = (
    data: Document[],
    page: number,
    itemsPerPage: number
  ) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data: Document[], itemsPerPage: number) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const getFileType = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "PDF";
      case "jpg":
      case "jpeg":
        return "Image";
      case "png":
        return "Image";
      default:
        return "Document";
    }
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    if (extension === "pdf") {
      return <Description color="error" />;
    }
    return <Description color="primary" />;
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            Access Documents
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Please login to view and manage your documents
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Documents
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Upload Document
          </Button>
        </Box>
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load documents. Please try again.
        </Alert>
      )}

      {/* Message State */}

      {/* Documents List */}
      {!isLoading && !error && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {documents.length === 0 ? (
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Alert severity="info">
                No documents uploaded yet. Upload your first document to get
                started.
              </Alert>
            </Box>
          ) : (
            getPaginatedData(documents, page, itemsPerPage).map(
              (document: Document) => (
                <Card key={document.document_id}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {getFileIcon(document.document_path)}
                      <Typography variant="h6" sx={{ ml: 1, flex: 1 }}>
                        {document.name ||
                          document.document_path.split("/").pop()}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Purpose: {document.purpose}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Type: {document.type.replace("_", " ")}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Uploaded:{" "}
                      {new Date(document.uploaded_at).toLocaleDateString()}
                    </Typography>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mt={2}
                    >
                      <Chip
                        label={
                          document.status?.charAt(0).toUpperCase() +
                            document.status?.slice(1) || "Uploaded"
                        }
                        color={
                          document.status === "approved"
                            ? "success"
                            : document.status === "rejected"
                            ? "error"
                            : document.status === "pending"
                            ? "warning"
                            : "default"
                        }
                        size="small"
                      />
                      <Box>
                        <Tooltip title="View Document">
                          <IconButton
                            size="small"
                            onClick={() => handleDocumentView(document)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Document">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleDocumentDownload(document)}
                          >
                            <Download />
                          </IconButton>
                        </Tooltip>
                        {document.status === "pending" && (
                          <Tooltip title="Delete Document">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDocumentDelete(document)}
                              disabled={deleteDocumentMutation.isLoading}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )
            )
          )}
        </Box>
      )}

      {/* Pagination */}
      {!isLoading && !error && documents.length > itemsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={getTotalPages(documents, itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Upload Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setValidationErrors({});
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              selectedFile={selectedFile}
              loading={uploadMutation.isLoading}
              error={
                uploadMutation.error ? String(uploadMutation.error) : undefined
              }
              success={uploadMutation.isSuccess}
              progress={uploadMutation.isLoading ? 50 : 0}
            />

            {selectedFile && (
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Document Name"
                  value={documentName}
                  onChange={(e) => {
                    setDocumentName(e.target.value);
                    if (validationErrors.documentName) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        documentName: undefined,
                      }));
                    }
                  }}
                  required
                  error={!!validationErrors.documentName}
                  helperText={validationErrors.documentName}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Document Purpose"
                  value={documentPurpose}
                  onChange={(e) => {
                    setDocumentPurpose(e.target.value);
                    if (validationErrors.documentPurpose) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        documentPurpose: undefined,
                      }));
                    }
                  }}
                  required
                  error={!!validationErrors.documentPurpose}
                  helperText={validationErrors.documentPurpose}
                  sx={{ mb: 2 }}
                />

                <FormControl
                  fullWidth
                  sx={{ mb: 2 }}
                  error={!!validationErrors.documentType}
                >
                  <InputLabel>Document Type</InputLabel>
                  <Select
                    value={documentType}
                    onChange={(e) => {
                      setDocumentType(e.target.value);
                      if (validationErrors.documentType) {
                        setValidationErrors((prev) => ({
                          ...prev,
                          documentType: undefined,
                        }));
                      }
                    }}
                    label="Document Type"
                    required
                  >
                    <MenuItem value="ID_PROOF">ID Proof</MenuItem>
                    <MenuItem value="ADDRESS_PROOF">Address Proof</MenuItem>
                    <MenuItem value="MARKSHEET">Marksheet</MenuItem>
                    <MenuItem value="PHOTO">Photo</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </Select>
                  {validationErrors.documentType && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, ml: 1.75 }}
                    >
                      {validationErrors.documentType}
                    </Typography>
                  )}
                </FormControl>

                <TextField
                  fullWidth
                  label="Description (Optional)"
                  multiline
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setValidationErrors({});
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={
              !selectedFile ||
              !documentName ||
              !documentPurpose ||
              !documentType ||
              uploadMutation.isLoading
            }
            startIcon={<Upload />}
          >
            {uploadMutation.isLoading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document View Dialog */}
      <Dialog
        open={documentDialogOpen}
        onClose={() => setDocumentDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Document Details</DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedDocument.name || "Document"}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Purpose:</strong> {selectedDocument.purpose}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Type:</strong>{" "}
                {selectedDocument.type?.replace("_", " ") ||
                  selectedDocument.document_type}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>File:</strong> {selectedDocument.original_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Size:</strong>{" "}
                {(selectedDocument.file_size / 1024 / 1024).toFixed(2)} MB
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Uploaded:</strong>{" "}
                {new Date(selectedDocument.uploaded_at).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Status:</strong>{" "}
                {selectedDocument.status?.charAt(0).toUpperCase() +
                  selectedDocument.status?.slice(1)}
              </Typography>
              {selectedDocument.rejection_reason && (
                <Typography variant="body2" color="error" gutterBottom>
                  <strong>Rejection Reason:</strong>{" "}
                  {selectedDocument.rejection_reason}
                </Typography>
              )}

              {/* Document Preview Section */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  border: "1px solid #ddd",
                  borderRadius: 1,
                  textAlign: "center",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Document Preview
                </Typography>
                {selectedDocument.mime_type?.startsWith("image/") ? (
                  <Box>
                    <img
                      src={getFileUrl(selectedDocument.document_path)}
                      alt={selectedDocument.original_name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "400px",
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const nextElement = e.currentTarget
                          .nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = "block";
                        }
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ display: "none" }}
                    >
                      Image preview not available
                    </Typography>
                  </Box>
                ) : selectedDocument.mime_type === "application/pdf" ? (
                  <Box>
                    <iframe
                      src={getFileUrl(selectedDocument.document_path)}
                      width="100%"
                      height="400px"
                      style={{ border: "none" }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const nextElement = e.currentTarget
                          .nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = "block";
                        }
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ display: "none" }}
                    >
                      PDF preview not available. Click download to view the
                      file.
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Preview not available for this file type
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Click download to view the file
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocumentDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => {
              if (selectedDocument) {
                handleDocumentDownload(selectedDocument);
              }
            }}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Documents;
