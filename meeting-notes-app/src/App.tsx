import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Stack
} from "@mui/material";
import Grid from "@mui/material/Grid";
import PrintIcon from "@mui/icons-material/Print";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotesIcon from "@mui/icons-material/Notes";
import ListIcon from "@mui/icons-material/List";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MDEditor from "@uiw/react-md-editor";
import Dexie from "dexie";

const Transition = React.forwardRef(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type MeetingNote = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  reportee: string;
  points: string; // Markdown
};

class NotesDB extends Dexie {
  notes!: Dexie.Table<MeetingNote, number>;
  constructor() {
    super("MeetingNotesDB");
    this.version(1).stores({
      notes: "++id,date,startTime,endTime,reportee,points",
    });
  }
}
const db = new NotesDB();

function App() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reportee, setReportee] = useState("");
  const [points, setPoints] = useState<string | undefined>("");
  const [notes, setNotes] = useState<MeetingNote[]>([]);
  const [open, setOpen] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const printRef = useRef<HTMLDivElement>(null);

  // Load notes from IndexedDB on mount
  useEffect(() => {
    db.notes.toArray().then(setNotes);
  }, []);

  // Add note and persist to DB
  // Utility to check if Markdown is "empty" (ignores whitespace and empty tags)
  function isMarkdownEmpty(md?: string) {
    if (!md) return true;
    // Remove Markdown formatting and HTML tags, then trim
    const text = md.replace(/[#_*>\-\d\.]/g, "").replace(/<[^>]+>/g, "").trim();
    return text.length === 0;
  }

  const handleAddNote = async () => {
    const missing: string[] = [];
    if (!date) missing.push("Date");
    if (!startTime) missing.push("Start Time");
    if (!endTime) missing.push("End Time");
    if (!reportee) missing.push("Reportee Name");
    if (isMarkdownEmpty(points)) missing.push("Discussion Points");

    if (missing.length > 0) {
      setMissingFields(missing);
      setOpen(true);
      return;
    }
    const newNote: MeetingNote = {
      id: Date.now(),
      date,
      startTime,
      endTime,
      reportee,
      points: points || "",
    };
    await db.notes.add(newNote);
    setNotes(await db.notes.toArray());
    setDate("");
    setStartTime("");
    setEndTime("");
    setReportee("");
    setPoints("");
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const printWindow = window.open("", "", "width=900,height=700");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Meeting Notes</title>
              <style>
                body { font-family: 'Roboto', sans-serif; margin: 40px; }
                h2 { color: #1976d2; }
                .note { margin-bottom: 24px; padding: 16px; border: 1px solid #eee; border-radius: 8px; }
                .note-title { font-weight: bold; color: #333; }
                .note-date { color: #555; }
                .note-points { margin-top: 8px; }
              </style>
            </head>
            <body>
              <h2>1x1 Meeting Notes</h2>
              ${printContents}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <AppBar position="static" color="primary" sx={{ borderRadius: 2, mb: 4 }}>
        <Toolbar>
          <NoteAddIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            1x1 Meeting Notes Tracker
          </Typography>
          <Tooltip title={viewMode === "card" ? "Show as List" : "Show as Cards"}>
            <IconButton
              color="inherit"
              onClick={() => setViewMode(viewMode === "card" ? "list" : "card")}
              sx={{ mr: 1 }}
              aria-label="toggle view"
            >
              {viewMode === "card" ? <ListIcon /> : <ViewModuleIcon />}
            </IconButton>
          </Tooltip>
          <Button
            color="inherit"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{ fontWeight: "bold" }}
          >
            Print Notes
          </Button>
        </Toolbar>
      </AppBar>
      <Paper elevation={4} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
          Add New Meeting Note
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Select date"
              InputLabelProps={{ shrink: !!date }}
              fullWidth
              InputProps={{
                startAdornment: <EventIcon sx={{ mr: 1, color: "primary.main" }} />,
              }}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TextField
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="Select start time"
              InputLabelProps={{ shrink: !!startTime }}
              fullWidth
              InputProps={{
                startAdornment: <AccessTimeIcon sx={{ mr: 1, color: "primary.main" }} />,
              }}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TextField
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="Select end time"
              InputLabelProps={{ shrink: !!endTime }}
              fullWidth
              InputProps={{
                startAdornment: <AccessTimeIcon sx={{ mr: 1, color: "primary.main" }} />,
              }}
            />
          </Box>
        </Box>
        <Stack spacing={2} direction={{ xs: "column", sm: "row" }} sx={{ mb: 2 }}>
          <TextField
            label="Reportee Name"
            value={reportee}
            onChange={(e) => setReportee(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <PersonIcon sx={{ mr: 1, color: "primary.main" }} />,
            }}
          />
        </Stack>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
            Discussion Points
          </Typography>
          <MDEditor
            value={points}
            onChange={setPoints}
            height={120}
            preview="edit"
            data-color-mode="light"
            textareaProps={{
              placeholder: "Use * or - for bullets, 1. for numbering, or any Markdown formatting.",
              style: { background: "#f5f7fa", borderRadius: 8 },
            }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleAddNote}
          sx={{ borderRadius: 2, fontWeight: "bold", px: 4, py: 1.5 }}
        >
          Add Note
        </Button>
      </Paper>
      <Box ref={printRef}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Meeting Notes
        </Typography>
        {notes.length === 0 ? (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No notes added yet.
          </Typography>
        ) : viewMode === "card" ? (
          <List>
            {notes.map((note) => (
              <Paper
                key={note.id}
                elevation={2}
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  background: "linear-gradient(90deg, #e3f2fd 0%, #fff 100%)",
                }}
                className="note"
              >
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemText
                    primary={
                      <span className="note-title">
                        <PersonIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        {note.reportee}
                      </span>
                    }
                    secondary={
                      <>
                        <span className="note-date">
                          <EventIcon sx={{ verticalAlign: "middle", mr: 0.5 }} />
                          {note.date}{" "}
                          <AccessTimeIcon sx={{ verticalAlign: "middle", mr: 0.5, ml: 2 }} />
                          {note.startTime} - {note.endTime}
                        </span>
                        <div className="note-points" style={{ marginTop: 8 }}>
                          <NotesIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                          <span>
                            <MDEditor.Markdown source={note.points} style={{ background: "none" }} />
                          </span>
                        </div>
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <List>
            {notes.map((note) => (
              <ListItem key={note.id} alignItems="flex-start" divider>
                <ListItemText
                  primary={
                    <span className="note-title">
                      <PersonIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                      {note.reportee}
                    </span>
                  }
                  secondary={
                    <>
                      <span className="note-date">
                        <EventIcon sx={{ verticalAlign: "middle", mr: 0.5 }} />
                        {note.date}{" "}
                        <AccessTimeIcon sx={{ verticalAlign: "middle", mr: 0.5, ml: 2 }} />
                        {note.startTime} - {note.endTime}
                      </span>
                      <div className="note-points" style={{ marginTop: 8 }}>
                        <NotesIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        <span>
                          <MDEditor.Markdown source={note.points} style={{ background: "none" }} />
                        </span>
                      </div>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
      >
        <DialogTitle>{"Missing Information"}</DialogTitle>
        <DialogContent>
          {missingFields.length > 0 ? (
            <>
              <Typography sx={{ mb: 1 }}>
                Please fill in the following field{missingFields.length > 1 ? "s" : ""}:
              </Typography>
              <ul>
                {missingFields.map((field) => (
                  <li key={field}>
                    <Typography component="span">{field}</Typography>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Typography>Please fill in all fields before adding a note.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setMissingFields([]);
            }}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
