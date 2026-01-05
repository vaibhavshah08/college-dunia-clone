import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  School,
  Book,
  AccountBalance,
  Description,
  ArrowForward,
} from "@mui/icons-material";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "../../hooks/useDebounce";
import collegesApi from "../../services/modules/colleges.api";
import coursesApi from "../../services/modules/courses.api";
import loansApi from "../../services/modules/loans.api";
import documentsApi from "../../services/modules/documents.api";

interface SearchResult {
  id: string;
  title: string;
  type: "college" | "course" | "loan" | "document";
  subtitle?: string;
  description?: string;
}

interface GlobalSearchProps {
  placeholder?: string;
  onClose?: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  placeholder = "Search colleges, courses, loans, documents...",
  onClose,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [results, setResults] = useState<SearchResult[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Search queries
  const { data: collegesData, isLoading: collegesLoading } = useQuery(
    ["search", "colleges", debouncedSearchTerm],
    () => collegesApi.getColleges({ q: debouncedSearchTerm }),
    {
      enabled: !!debouncedSearchTerm && debouncedSearchTerm.length >= 2,
      staleTime: 0,
    }
  );

  const { data: coursesData, isLoading: coursesLoading } = useQuery(
    ["search", "courses", debouncedSearchTerm],
    () => coursesApi.getCourses({ q: debouncedSearchTerm, limit: 5 }),
    {
      enabled: !!debouncedSearchTerm && debouncedSearchTerm.length >= 2,
      staleTime: 0,
    }
  );

  const {
    data: loansData,
    isLoading: loansLoading,
    error: loansError,
  } = useQuery(
    ["search", "loans", debouncedSearchTerm],
    () => loansApi.getMyLoans(),
    {
      enabled: !!debouncedSearchTerm && debouncedSearchTerm.length >= 2,
      staleTime: 0,
      retry: false,
      onError: (error) => {
        console.error("Loans search error:", error);
      },
    }
  );

  const {
    data: documentsData,
    isLoading: documentsLoading,
    error: documentsError,
  } = useQuery(
    ["search", "documents", debouncedSearchTerm],
    () => documentsApi.getUserDocuments(1, 100),
    {
      enabled: !!debouncedSearchTerm && debouncedSearchTerm.length >= 2,
      staleTime: 0,
      retry: false,
      onError: (error) => {
        console.error("Documents search error:", error);
      },
    }
  );

  const isLoading =
    collegesLoading || coursesLoading || loansLoading || documentsLoading;

  // Process search results
  useEffect(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
      setResults([]);
      return;
    }

    // Don't process results if there are errors
    if (loansError || documentsError) {
      console.warn("Search errors detected, skipping result processing");
      return;
    }

    const newResults: SearchResult[] = [];

    // Add colleges
    if (collegesData) {
      const colleges = Array.isArray(collegesData) ? collegesData : (collegesData.colleges || []);
      colleges.slice(0, 5).forEach((college) => {
        newResults.push({
          id: college.college_id,
          title: college.college_name,
          type: "college",
          subtitle: `${college.city}, ${college.state}`,
          description: `Ranking: ${college.ranking || "N/A"}`,
        });
      });
    }

    // Add courses
    if (coursesData?.courses) {
      coursesData.courses.slice(0, 5).forEach((course) => {
        newResults.push({
          id: course.id,
          title: course.name,
          type: "course",
          subtitle: course.stream,
          description: `${course.duration_years} years`,
        });
      });
    }

    // Add loans (with client-side filtering)
    if (loansData && Array.isArray(loansData) && !loansError) {
      try {
        const filteredLoans = loansData.filter((loan) => {
          const searchLower = debouncedSearchTerm.toLowerCase();
          return (
            loan.loan_id?.toLowerCase().includes(searchLower) ||
            loan.status?.toLowerCase().includes(searchLower) ||
            loan.first_name?.toLowerCase().includes(searchLower) ||
            loan.last_name?.toLowerCase().includes(searchLower)
          );
        });

        filteredLoans.slice(0, 5).forEach((loan) => {
          newResults.push({
            id: loan.loan_id,
            title: `Loan Application #${
              loan.loan_id?.slice(0, 8) || "Unknown"
            }`,
            type: "loan",
            subtitle: loan.status || "Unknown",
            description: `Amount: ₹${loan.principal_amount || "N/A"}`,
          });
        });
      } catch (error) {
        console.error("Error processing loans data:", error);
      }
    }

    // Add documents (with client-side filtering)
    if (documentsData && Array.isArray(documentsData) && !documentsError) {
      try {
        const filteredDocuments = documentsData.filter((document) => {
          const searchLower = debouncedSearchTerm.toLowerCase();
          return (
            document.name?.toLowerCase().includes(searchLower) ||
            document.document_type?.toLowerCase().includes(searchLower) ||
            document.purpose?.toLowerCase().includes(searchLower) ||
            document.status?.toLowerCase().includes(searchLower)
          );
        });

        filteredDocuments.slice(0, 5).forEach((document) => {
          newResults.push({
            id: document.document_id,
            title: document.name || "Unknown Document",
            type: "document",
            subtitle: document.document_type || "Unknown",
            description: document.status || "Unknown",
          });
        });
      } catch (error) {
        console.error("Error processing documents data:", error);
      }
    }

    setResults(newResults);
  }, [
    collegesData,
    coursesData,
    loansData,
    documentsData,
    loansError,
    documentsError,
    debouncedSearchTerm,
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case "college":
        return <School />;
      case "course":
        return <Book />;
      case "loan":
        return <AccountBalance />;
      case "document":
        return <Description />;
      default:
        return <Search />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "college":
        return "primary";
      case "course":
        return "secondary";
      case "loan":
        return "success";
      case "document":
        return "warning";
      default:
        return "default";
    }
  };

  const handleResultClick = (result: SearchResult) => {
    let path = "";
    switch (result.type) {
      case "college":
        path = `/colleges/${result.id}`;
        break;
      case "course":
        path = `/courses/${result.id}`;
        break;
      case "loan":
        path = `/loans/${result.id}`;
        break;
      case "document":
        path = `/documents`;
        break;
    }

    if (path) {
      navigate(path);
      setIsOpen(false);
      setSearchTerm("");
      onClose?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        onClose?.();
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(value.length >= 2);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (searchTerm.length >= 2) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay to allow click events on results
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <TextField
        ref={inputRef}
        fullWidth
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        size={isMobile ? "medium" : "small"}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
            borderRadius: 3,
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            },
            "&.Mui-focused": {
              boxShadow: "0 6px 20px rgba(25, 118, 210, 0.2)",
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "primary.main" }} />
            </InputAdornment>
          ),
          endAdornment: isLoading && (
            <InputAdornment position="end">
              <CircularProgress size={20} />
            </InputAdornment>
          ),
        }}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Paper
              ref={listRef}
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 1000,
                mt: 1,
                maxHeight: 400,
                overflow: "auto",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                borderRadius: 3,
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              {results.length === 0 && !isLoading && searchTerm.length >= 2 && (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    No results found for "{searchTerm}"
                  </Typography>
                </Box>
              )}

              {results.length > 0 && (
                <List sx={{ p: 1 }}>
                  {results.map((result, index) => (
                    <motion.div
                      key={`${result.type}-${result.id}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <ListItem
                        disablePadding
                        sx={{
                          borderRadius: 2,
                          mb: 0.5,
                          "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.04)",
                          },
                        }}
                      >
                        <ListItemButton
                          onClick={() => handleResultClick(result)}
                          selected={selectedIndex === index}
                          sx={{
                            borderRadius: 2,
                            "&.Mui-selected": {
                              backgroundColor: "rgba(25, 118, 210, 0.08)",
                              "&:hover": {
                                backgroundColor: "rgba(25, 118, 210, 0.12)",
                              },
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {getIcon(result.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography variant="body1" fontWeight={500}>
                                  {result.title}
                                </Typography>
                                <Chip
                                  label={result.type}
                                  size="small"
                                  color={getTypeColor(result.type) as any}
                                  sx={{
                                    textTransform: "capitalize",
                                    fontSize: "0.7rem",
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                {result.subtitle && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {result.subtitle}
                                  </Typography>
                                )}
                                {result.description && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {result.description}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          <ArrowForward
                            sx={{ color: "text.secondary", fontSize: 16 }}
                          />
                        </ListItemButton>
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              )}

              {isLoading && (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <CircularProgress size={24} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Searching...
                  </Typography>
                </Box>
              )}
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default GlobalSearch;
