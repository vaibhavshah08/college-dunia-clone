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
import loansApi from "../../services/modules/loans.api";
import { getErrorMessage } from "../../utils/errorHandler";
import { useToast } from "../../contexts/ToastContext";
import FileUpload from "../../components/FileUpload/FileUpload";
import { Document, Loan } from "../../types/api";
import {
  AnimatedPage,
  AnimatedList,
  AnimatedCard,
  AnimatedButton,
} from "../../components/Motion";

// Get file URL for preview
const getFileUrl = (documentPath: string) => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";
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
  const [isForLoan, setIsForLoan] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [mutationInProgress, setMutationInProgress] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    documentName?: string;
    documentPurpose?: string;
    documentType?: string;
  }>({});
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [downloadingDocuments, setDownloadingDocuments] = useState<Set<string>>(
    new Set()
  );

  // Pagination state
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch user documents with server-side pagination
  const {
    data: documentsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["documents", page],
    queryFn: async () => {
      const response = await documentsApi.getUserDocuments(page, itemsPerPage);
      // Handle both paginated and non-paginated responses
      if (response && typeof response === "object" && "documents" in response) {
        return response;
      }
      return {
        documents: response as Document[],
        pagination: {
          page: 1,
          limit: itemsPerPage,
          total: (response as Document[]).length,
          totalPages: 1,
        },
      };
    },
    enabled: isAuthenticated,
    keepPreviousData: true,
  });

  const documents = documentsResponse?.documents || [];
  const documentsPagination = documentsResponse?.pagination;

  // Fetch user loans for association (fetch all for form dropdown)
  const { data: loansResponse } = useQuery({
    queryKey: ["loans", "me", "all"],
    queryFn: () => loansApi.getMyLoans(1, 1000),
    enabled: isAuthenticated,
  });
  const loans = Array.isArray(loansResponse)
    ? loansResponse
    : loansResponse?.loans || [];

  // Upload document mutation
  const uploadMutation = useMutation({
    mutationFn: ({
      file,
      name,
      purpose,
      type,
      documentType,
      loanId,
    }: {
      file: File;
      name: string;
      purpose: string;
      type: string;
      documentType?: string;
      loanId?: string;
    }) =>
      documentsApi.uploadDocument(
        file,
        name,
        purpose,
        type,
        documentType,
        loanId
      ),
    onSuccess: () => {
      if (!mutationInProgress) {
        setMutationInProgress(true);
        queryClient.invalidateQueries({ queryKey: ["documents"] });
        setOpenDialog(false);
        setSelectedFile(null);
        setDocumentName("");
        setDocumentPurpose("");
        setDocumentType("");
        setDescription("");
        setIsForLoan(false);
        setSelectedLoanId("");
        setValidationErrors({});
        toast.success("Document uploaded successfully");
        setTimeout(() => setMutationInProgress(false), 1000);
      }
    },
    onError: (error: any) => {
      console.error("Upload error:", error);
      toast.error("Failed to upload document");
      setMutationInProgress(false);
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
        documentType: description || undefined, // This will be stored in the legacy document_type field
        loanId: isForLoan && selectedLoanId ? selectedLoanId : undefined,
      });
    }
  };

  const handleDocumentView = (document: Document) => {
    setSelectedDocument(document);
    setDocumentDialogOpen(true);
  };

  const handleDocumentDownload = async (document: Document) => {
    const documentId = document.document_id;

    // Add to downloading set
    setDownloadingDocuments((prev) => new Set(prev).add(documentId));

    try {
      const blob = await documentsApi.downloadDocument(documentId);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = document.original_name;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);

      toast.success("Document downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download document. Please try again.");

      // Fallback: try direct URL
      try {
        const fileUrl = getFileUrl(document.document_path);
        window.open(fileUrl, "_blank");
      } catch (fallbackError) {
        console.error("Fallback download also failed:", fallbackError);
        toast.error("Unable to download document. Please contact support.");
      }
    } finally {
      // Remove from downloading set
      setDownloadingDocuments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: string) =>
      documentsApi.deleteMyDocument(documentId),
    onSuccess: () => {
      if (!mutationInProgress) {
        setMutationInProgress(true);
        queryClient.invalidateQueries({ queryKey: ["documents"] });
        toast.success("Document deleted successfully");
        setTimeout(() => setMutationInProgress(false), 1000);
      }
    },
    onError: (error: any) => {
      console.error("Delete document error:", error);
      toast.error(
        "Failed to delete document. Only pending documents can be deleted."
      );
      setMutationInProgress(false);
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["documents"] });
    } finally {
      setIsRefreshing(false);
    }
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
    <AnimatedPage>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <Description sx={{ fontSize: 48, color: "#1976D2" }} />
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              fontWeight="bold"
              sx={{
                background: "linear-gradient(45deg, #1976D2, #42A5F5)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 0,
              }}
            >
              My Documents
            </Typography>
          </Box>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: "auto", mb: 3 }}
          >
            Manage and organize your important documents. Upload, view, and
            track your document status.
          </Typography>
        </Box>

        {/* Upload Section */}
        <Card
          sx={{
            mb: 4,
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            border: "none",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#2c3e50" }}
              >
                📄 Document Management
              </Typography>
              <Box display="flex" gap={2} flexWrap="nowrap">
                <Button
                  variant="outlined"
                  startIcon={
                    isRefreshing ? <CircularProgress size={16} /> : <Refresh />
                  }
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  sx={{
                    display: { xs: "none", sm: "flex" },
                  }}
                >
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </Button>
                <IconButton
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  size="large"
                  sx={{
                    display: { xs: "flex", sm: "none" },
                  }}
                  aria-label="Refresh"
                >
                  {isRefreshing ? <CircularProgress size={20} /> : <Refresh />}
                </IconButton>
                <AnimatedButton
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenDialog(true)}
                  sx={{
                    minWidth: { xs: "auto", sm: "auto" },
                    px: { xs: 2, sm: 3 },
                    background: "linear-gradient(45deg, #1976D2, #42A5F5)",
                    fontWeight: 600,
                    "&:hover": {
                      background: "linear-gradient(45deg, #1565C0, #1976D2)",
                    },
                  }}
                >
                  <Box sx={{ display: { xs: "none", sm: "inline" } }}>
                    Upload Document
                  </Box>
                  <Box sx={{ display: { xs: "inline", sm: "none" } }}>
                    Upload
                  </Box>
                </AnimatedButton>
              </Box>
            </Box>
          </CardContent>
        </Card>

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
        {!isLoading && !error && documents.length === 0 && (
          <Box sx={{ width: "100%", mb: 4 }}>
            <Alert severity="info" sx={{ width: "100%" }}>
              No documents uploaded yet. Upload your first document to get
              started.
            </Alert>
          </Box>
        )}

        {/* Documents List */}
        {!isLoading && !error && documents.length > 0 && (
          <AnimatedList
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
            staggerDelay={0.08}
          >
            {documents.map((document: Document, index: number) => (
              <AnimatedCard key={document.document_id} delay={index * 0.08}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background:
                      "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    borderRadius: 3,
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                      borderColor: "#1976D2",
                      "& .document-card-overlay": {
                        opacity: 1,
                      },
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: "linear-gradient(90deg, #1976D2, #42A5F5)",
                      transform: "scaleX(0)",
                      transition: "transform 0.3s ease",
                    },
                    "&:hover::before": {
                      transform: "scaleX(1)",
                    },
                  }}
                >
                  <Box
                    className="document-card-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(66, 165, 245, 0.1) 100%)",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      zIndex: 1,
                    }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
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
                            disabled={downloadingDocuments.has(
                              document.document_id
                            )}
                          >
                            {downloadingDocuments.has(document.document_id) ? (
                              <CircularProgress size={16} />
                            ) : (
                              <Download />
                            )}
                          </IconButton>
                        </Tooltip>
                        {document.status === "pending" ? (
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
                        ) : (
                          <Tooltip title="Only pending documents can be deleted">
                            <IconButton size="small" color="error" disabled>
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </AnimatedList>
        )}

        {/* Pagination */}
        {!isLoading &&
          !error &&
          documentsPagination &&
          documentsPagination.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={documentsPagination.totalPages}
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
                  uploadMutation.error
                    ? String(uploadMutation.error)
                    : undefined
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
                      <MenuItem value="General">General</MenuItem>
                      <MenuItem value="Identity Proof">Identity Proof</MenuItem>
                      <MenuItem value="Address Proof">Address Proof</MenuItem>
                      <MenuItem value="Academic Document">
                        Academic Document
                      </MenuItem>
                      <MenuItem value="Financial Document">
                        Financial Document
                      </MenuItem>
                      <MenuItem value="Marksheet">Marksheet</MenuItem>
                      <MenuItem value="Photo">Photo</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
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

                  {/* Loan Association Toggle */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Is this document for a loan application?
                    </Typography>
                    <FormControl component="fieldset">
                      <Box display="flex" gap={2}>
                        <Button
                          variant={isForLoan ? "contained" : "outlined"}
                          onClick={() => setIsForLoan(true)}
                          size="small"
                        >
                          Yes
                        </Button>
                        <Button
                          variant={!isForLoan ? "contained" : "outlined"}
                          onClick={() => {
                            setIsForLoan(false);
                            setSelectedLoanId("");
                          }}
                          size="small"
                        >
                          No
                        </Button>
                      </Box>
                    </FormControl>
                  </Box>

                  {/* Loan Selection */}
                  {isForLoan && (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Select Loan</InputLabel>
                      <Select
                        value={selectedLoanId}
                        onChange={(e) => setSelectedLoanId(e.target.value)}
                        label="Select Loan"
                      >
                        {loans
                          .filter((loan) => loan.status === "submitted")
                          .map((loan) => (
                            <MenuItem key={loan.loan_id} value={loan.loan_id}>
                              {loan.loan_type} - ₹
                              {loan.principal_amount.toLocaleString()}(
                              {loan.college_id})
                            </MenuItem>
                          ))}
                      </Select>
                      {loans.filter((loan) => loan.status === "submitted")
                        .length === 0 && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          No pending loans available for association
                        </Typography>
                      )}
                    </FormControl>
                  )}

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
                setIsForLoan(false);
                setSelectedLoanId("");
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
                {selectedDocument.document_type && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    <strong>Description:</strong>{" "}
                    {selectedDocument.document_type}
                  </Typography>
                )}
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
              startIcon={
                selectedDocument &&
                downloadingDocuments.has(selectedDocument.document_id) ? (
                  <CircularProgress size={16} />
                ) : (
                  <Download />
                )
              }
              onClick={() => {
                if (selectedDocument) {
                  handleDocumentDownload(selectedDocument);
                }
              }}
              disabled={
                selectedDocument
                  ? downloadingDocuments.has(selectedDocument.document_id)
                  : false
              }
            >
              {selectedDocument &&
              downloadingDocuments.has(selectedDocument.document_id)
                ? "Downloading..."
                : "Download"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AnimatedPage>
  );
};

export default Documents;
