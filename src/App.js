import { useState, useEffect, useMemo } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Stack,
  Box,
  IconButton,
  CssBaseline,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Task from "./Task";

const LOCAL_STORAGE_KEY = "todo-app-tasks";

function App() {
  // Theme state: light/dark, persisted in localStorage
  const getInitialMode = () => {
    const stored = localStorage.getItem("todo-app-mode");
    return stored === "dark" ? "dark" : "light";
  };
  const [mode, setMode] = useState(getInitialMode);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                background: {
                  default: "#f6f7fb",
                  paper: "#fff",
                },
              }
            : {
                background: {
                  default: "#181a1b",
                  paper: "#23272f",
                },
                primary: { main: "#90caf9" },
              }),
        },
      }),
    [mode]
  );

  // Save mode to localStorage when changed
  useEffect(() => {
    localStorage.setItem("todo-app-mode", mode);
  }, [mode]);
  // Load tasks from localStorage before first render
  const getInitialTasks = () => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  };
  const [tasks, setTasks] = useState(getInitialTasks);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Sync tasks from localStorage if changed elsewhere
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setTasks(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Add, edit, delete, toggle, and filter tasks
  const handleAddTask = () => {
    if (input.trim() === "") return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: input.trim(), completed: false },
    ]);
    setInput("");
  };
  const handleEditTask = (id, text) => {
    setEditId(id);
    setEditText(text);
  };
  const handleSaveEdit = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text: editText } : t)));
    setEditId(null);
    setEditText("");
  };
  const handleCancelEdit = () => {
    setEditId(null);
    setEditText("");
  };
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };
  const handleToggleCompleted = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };
  const filteredTasks = useMemo(() => {
    if (filter === "completed") return tasks.filter((t) => t.completed);
    if (filter === "incomplete") return tasks.filter((t) => !t.completed);
    return tasks;
  }, [tasks, filter]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="sm"
        sx={{
          pt: { xs: 4, sm: 7 },
          pb: 4,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 5, textAlign: "center", position: "relative" }}>
          <Typography
            variant="h4"
            sx={{
              mb: 1,
              fontWeight: 700,
              color: "primary.main",
              letterSpacing: 1,
            }}
          >
            To-Do List
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Minimal, Professional and Responsive
          </Typography>
          {/* Theme toggle button */}
          <IconButton
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 2,
            }}
            onClick={() =>
              setMode((prev) => (prev === "light" ? "dark" : "light"))
            }
            color="primary"
            aria-label="Toggle light/dark mode"
          >
            {mode === "light" ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Box>

        {/* Input Section */}
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <TextField
            label="Add a new task"
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            fullWidth
            size="small"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTask();
            }}
            sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTask}
            disabled={input.trim() === ""}
            sx={{
              minWidth: 100,
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            Add
          </Button>
        </Stack>

        {/* Filter Buttons Section */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 4, justifyContent: "center" }}
        >
          <Button
            variant={filter === "all" ? "contained" : "outlined"}
            onClick={() => setFilter("all")}
            sx={{
              fontWeight: 500,
              borderRadius: 2,
              boxShadow: filter === "all" ? 2 : 0,
            }}
          >
            All
          </Button>
          <Button
            variant={filter === "completed" ? "contained" : "outlined"}
            onClick={() => setFilter("completed")}
            color="success"
            sx={{
              fontWeight: 500,
              borderRadius: 2,
              boxShadow: filter === "completed" ? 2 : 0,
            }}
          >
            Completed
          </Button>
          <Button
            variant={filter === "incomplete" ? "contained" : "outlined"}
            onClick={() => setFilter("incomplete")}
            color="info"
            sx={{
              fontWeight: 500,
              borderRadius: 2,
              boxShadow: filter === "incomplete" ? 2 : 0,
            }}
          >
            Incomplete
          </Button>
        </Stack>

        {/* Task List Section */}
        <Stack spacing={2} sx={{ mb: 2 }}>
          {filteredTasks.length === 0 ? (
            <Typography color="text.secondary" align="center">
              No tasks found.
            </Typography>
          ) : (
            filteredTasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                editId={editId}
                editText={editText}
                onToggleCompleted={handleToggleCompleted}
                onEditTask={handleEditTask}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onDeleteTask={handleDeleteTask}
                setEditText={setEditText}
              />
            ))
          )}
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;
