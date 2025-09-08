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
} from "@mui/material";
import {
  Add,
  Description,
  Visibility,
  Delete,
  Upload,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../lib/hooks/useAuth";
import documentsApi from "../../services/modules/documents.api";
import FileUpload from "../../components/FileUpload/FileUpload";
import { Document } from "../../types/api";

const Documents: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [description, setDescription] = useState("");

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
    mutationFn: documentsApi.uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setOpenDialog(false);
      setSelectedFile(null);
      setDocumentType("");
      setDescription("");
    },
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
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
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Upload Document
        </Button>
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
            documents.map((document: Document) => (
              <Card key={document.document_id}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    {getFileIcon(document.document_path)}
                    <Typography variant="h6" sx={{ ml: 1, flex: 1 }}>
                      {document.document_path.split("/").pop()}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Type: {getFileType(document.document_path)}
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
                    <Chip label="Uploaded" color="success" size="small" />
                    <Box>
                      <Tooltip title="View Document">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Document">
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}

      {/* Upload Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
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
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Document Type</InputLabel>
                  <Select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    label="Document Type"
                  >
                    <MenuItem value="admission">Admission Letter</MenuItem>
                    <MenuItem value="identity">Identity Proof</MenuItem>
                    <MenuItem value="income">Income Certificate</MenuItem>
                    <MenuItem value="academic">Academic Transcript</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
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
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!selectedFile || uploadMutation.isLoading}
            startIcon={<Upload />}
          >
            {uploadMutation.isLoading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Documents;
