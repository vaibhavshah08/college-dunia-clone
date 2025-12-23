import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Pagination,
  CircularProgress,
  Alert,
  Tooltip,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  Visibility,
  Delete,
  Email,
  Person,
  Subject,
  CalendarToday,
  MarkEmailRead,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import messagesApi from "../../services/modules/messages.api";
import { Message } from "../../types/api";
import { useToast } from "../../contexts/ToastContext";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

interface MessageDetailModalProps {
  message: Message | null;
  open: boolean;
  onClose: () => void;
  onMarkAsRead: (messageId: string) => void;
  onDelete: (messageId: string) => void;
}

const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
  message,
  open,
  onClose,
  onMarkAsRead,
  onDelete,
}) => {
  if (!message) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Email color="primary" />
          <Typography variant="h6">Message Details</Typography>
          {!message.is_read && (
            <Chip label="Unread" color="primary" size="small" />
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Person color="action" />
                <Typography variant="subtitle2" color="text.secondary">
                  From:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {message.name}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email color="action" />
                <Typography variant="subtitle2" color="text.secondary">
                  Email:
                </Typography>
                <Typography variant="body1">{message.email}</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Subject color="action" />
                <Typography variant="subtitle2" color="text.secondary">
                  Subject:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {message.subject}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarToday color="action" />
                <Typography variant="subtitle2" color="text.secondary">
                  Received:
                </Typography>
                <Typography variant="body1">
                  {formatDistanceToNow(new Date(message.created_at), {
                    addSuffix: true,
                  })}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Message:
        </Typography>
        <Paper sx={{ p: 2, bgcolor: "grey.50", minHeight: 100 }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {message.message}
          </Typography>
        </Paper>
      </DialogContent>
      <DialogActions>
        {!message.is_read && (
          <Button
            onClick={() => onMarkAsRead(message.message_id)}
            startIcon={<MarkEmailRead />}
            variant="outlined"
          >
            Mark as Read
          </Button>
        )}
        <Button
          onClick={() => onDelete(message.message_id)}
          startIcon={<Delete />}
          color="error"
          variant="outlined"
        >
          Delete
        </Button>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MessagesManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null);
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();

  const {
    data: messagesData,
    isLoading,
    error,
  } = useQuery(["messages", page], () => messagesApi.getAllMessages(page, 10), {
    keepPreviousData: true,
  });

  const markAsReadMutation = useMutation(messagesApi.markAsRead, {
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
      setSelectedMessage((prev) => (prev ? { ...prev, is_read: true } : null));
    },
    onError: () => {
      showError("Failed to mark message as read");
    },
  });

  const deleteMutation = useMutation(messagesApi.deleteMessage, {
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
      success("Message deleted successfully");
      setModalOpen(false);
      setSelectedMessage(null);
    },
    onError: () => {
      showError("Failed to delete message");
    },
  });

  const handleViewMessage = async (messageId: string) => {
    setLoadingMessageId(messageId);
    try {
      const message = await messagesApi.getMessageById(messageId);
      setSelectedMessage(message);
      setModalOpen(true);
    } catch (err) {
      showError("Failed to load message details");
    } finally {
      setLoadingMessageId(null);
    }
  };

  const handleMarkAsRead = (messageId: string) => {
    markAsReadMutation.mutate(messageId);
  };

  const handleDelete = (messageId: string) => {
    deleteMutation.mutate(messageId);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load messages. Please try again.
      </Alert>
    );
  }

  const messages = messagesData?.messages || [];
  const totalPages = messagesData?.totalPages || 1;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Contact Messages ({messagesData?.total || 0})
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Received</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 4 }}
                  >
                    No messages found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              messages.map((message) => (
                <TableRow key={message.message_id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                      {message.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{message.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {message.subject}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={message.is_read ? "Read" : "Unread"}
                      color={message.is_read ? "default" : "primary"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDistanceToNow(new Date(message.created_at), {
                        addSuffix: true,
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton
                        onClick={() => handleViewMessage(message.message_id)}
                        size="small"
                        disabled={loadingMessageId === message.message_id}
                      >
                        {loadingMessageId === message.message_id ? (
                          <CircularProgress size={20} />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      )}

      <MessageDetailModal
        message={selectedMessage}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedMessage(null);
        }}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default MessagesManagement;
