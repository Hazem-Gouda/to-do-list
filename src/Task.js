import {
  Card,
  CardContent,
  Checkbox,
  Typography,
  IconButton,
  TextField,
  Box,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, Save, Cancel } from "@mui/icons-material";

// Task component: displays a single to-do item and its actions
// Props:
//   task: { id, text, completed }
//   editId: id of the task being edited
//   editText: current text in the edit field
//   onToggleCompleted: toggles completed state
//   onEditTask: starts editing
//   onSaveEdit: saves edit
//   onCancelEdit: cancels edit
//   onDeleteTask: deletes task
//   setEditText: sets edit text
function Task({
  task,
  editId,
  editText,
  onToggleCompleted,
  onEditTask,
  onSaveEdit,
  onCancelEdit,
  onDeleteTask,
  setEditText,
}) {
  // Returns icon color for edit/save/cancel (blue for active, dark grey for completed)
  const getEditIconColor = () =>
    task.completed ? { color: "#444" } : { color: "#1976d2" };

  // Card background styles
  const completedCardStyle = {
    background: "linear-gradient(90deg, #b2f7ef 0%, #e0ffe0 100%)",
    borderLeft: "6px solid #43e97b",
    opacity: 0.95,
    boxShadow: "0 4px 16px rgba(67, 233, 123, 0.10)",
  };
  const incompleteCardStyle = {
    background: "linear-gradient(90deg, #e3f0ff 0%, #f9fdff 100%)",
    borderLeft: "6px solid #1976d2",
    boxShadow: "0 2px 12px rgba(25, 118, 210, 0.10)",
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 4,
        ...(task.completed ? completedCardStyle : incompleteCardStyle),
        transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
        "&:hover": {
          boxShadow: task.completed
            ? "0 6px 24px rgba(67, 233, 123, 0.18)"
            : "0 6px 24px rgba(25, 118, 210, 0.18)",
        },
      }}
      elevation={task.completed ? 2 : 4}
    >
      <CardContent sx={{ display: "flex", alignItems: "center", py: 2, px: 2 }}>
        {/* Checkbox to mark as completed */}
        <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={task.completed}
            onChange={() => onToggleCompleted(task.id)}
            color={task.completed ? "success" : "primary"}
            sx={{
              p: 0.5,
              ...(!task.completed
                ? { color: "#111", "&.Mui-checked": { color: "#111" } }
                : {}),
            }}
          />
        </Box>

        {/* Show TextField if editing, otherwise show task text */}
        {editId === task.id ? (
          <TextField
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            size="small"
            sx={{
              flex: 1,
              mr: 2,
              background: "#fff",
              borderRadius: 2,
              "& .MuiInputBase-input": {
                color: "#111",
              },
            }}
            autoFocus
            inputProps={{ maxLength: 60 }}
          />
        ) : (
          <Typography
            variant="body1"
            sx={{
              flex: 1,
              textDecoration: task.completed ? "line-through" : "none",
              color: task.completed ? "#43e97b" : "#1976d2",
              fontWeight: 600,
              letterSpacing: 0.2,
              fontSize: "1.1rem",
              transition: "color 0.2s",
              px: 1,
            }}
          >
            {task.text}
          </Typography>
        )}

        {/* Action buttons: edit/save/cancel/delete */}
        <Box sx={{ display: "flex", gap: 1, ml: 1 }}>
          {editId === task.id ? (
            <>
              {/* Save button */}
              <Tooltip title="Save">
                <span>
                  <IconButton
                    color="primary"
                    onClick={() => onSaveEdit(task.id)}
                    disabled={editText.trim() === ""}
                    size="small"
                    sx={getEditIconColor()}
                  >
                    <Save />
                  </IconButton>
                </span>
              </Tooltip>
              {/* Cancel button */}
              <Tooltip title="Cancel">
                <IconButton
                  color="secondary"
                  onClick={onCancelEdit}
                  size="small"
                  sx={getEditIconColor()}
                >
                  <Cancel />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              {/* Edit button (disabled for completed tasks) */}
              <Tooltip title="Edit">
                <span>
                  <IconButton
                    color={task.completed ? "default" : "primary"}
                    onClick={() => onEditTask(task.id, task.text)}
                    size="small"
                    disabled={task.completed}
                    sx={getEditIconColor()}
                  >
                    <Edit />
                  </IconButton>
                </span>
              </Tooltip>
              {/* Delete button */}
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={() => onDeleteTask(task.id)}
                  size="small"
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default Task;
