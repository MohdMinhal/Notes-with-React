import { useState, useEffect } from "react";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [isNotePreviewVisible, setNotePreviewVisibility] = useState(false);

  useEffect(() => {
    refreshNotes();
  }, []);

  const refreshNotes = () => {
    const notesFromStorage = JSON.parse(
      localStorage.getItem("notesapp-notes") || "[]"
    );
    setNotes(notesFromStorage);
    if (notesFromStorage.length > 0) {
      setActiveNote(notesFromStorage[0]);
    }
  };

  const saveNote = (noteToSave) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteToSave.id ? noteToSave : note
    );
    if (!notes.find((note) => note.id === noteToSave.id)) {
      noteToSave.updated = new Date().toISOString();
      updatedNotes.push(noteToSave);
    }
    localStorage.setItem("notesapp-notes", JSON.stringify(updatedNotes));
    refreshNotes();
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    localStorage.setItem("notesapp-notes", JSON.stringify(updatedNotes));
    refreshNotes();
    window.location.reload();
  };

  const handleNoteSelect = (id) => {
    const selectedNote = notes.find((note) => note.id === id);
    setActiveNote(selectedNote);
    setNotePreviewVisibility(true);
  };

  const handleNoteAdd = () => {
    const newNote = {
      id: Math.floor(Math.random() * 1000000),
      title: "",
      body: "",
    };
    saveNote(newNote);
  };

  const handleNoteEdit = (updatedTitle, updatedBody) => {
    if (activeNote) {
      saveNote({
        ...activeNote,
        title: updatedTitle,
        body: updatedBody,
      });
    }
  };

  const handleNoteDelete = () => {
    if (activeNote) {
      deleteNote(activeNote.id);
    }
  };

  return (
    <div className="notes">
      <div className="notes__sidebar">
        <button className="notes__add" type="button" onClick={handleNoteAdd}>
          Add Note
        </button>
        <div className="notes__list">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`notes__list-item ${
                activeNote && activeNote.id === note.id
                  ? "notes__list-item--selected"
                  : ""
              }`}
              onClick={() => handleNoteSelect(note.id)}
              onDoubleClick={handleNoteDelete}
            >
              <div className="notes__small-title">{note.title}</div>
              <div className="notes__small-updated">
                {new Date(note.updated).toLocaleString(undefined, {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="notes__preview"
        style={{ visibility: isNotePreviewVisible ? "visible" : "hidden" }}
      >
        <input
          className="notes__title"
          type="text"
          placeholder="New Note..."
          value={activeNote ? activeNote.title : ""}
          onChange={(e) =>
            handleNoteEdit(e.target.value, activeNote ? activeNote.body : "")
          }
        />
        <textarea
          className="notes__body"
          placeholder="Take Note..."
          value={activeNote ? activeNote.body : ""}
          onChange={(e) =>
            handleNoteEdit(activeNote ? activeNote.title : "", e.target.value)
          }
        />
      </div>
    </div>
  );
}

export default Notes;
