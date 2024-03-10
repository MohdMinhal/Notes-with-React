import React, { useState, useEffect } from "react";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isNotePreviewVisible, setNotePreviewVisibility] = useState(false);

  useEffect(() => {
    refreshNotes();
  }, []);

  const refreshNotes = () => {
    const notesFromStorage = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
    setNotes(notesFromStorage);
    if (notesFromStorage.length > 0) {
      setActiveNoteId(notesFromStorage[0]?.id); // Set the active note ID to the first note's ID
    }
  };

  const saveNote = (updatedNote) => {
    const updatedNotes = [...notes];
    const index = updatedNotes.findIndex(note => note.id === updatedNote.id);
    if (index !== -1) {
      updatedNotes[index] = updatedNote;
    } else {
      updatedNotes.push(updatedNote);
    }
    localStorage.setItem("notesapp-notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    localStorage.setItem("notesapp-notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
    setActiveNoteId(null);
    setNotePreviewVisibility(false);
  };

  const handleNoteSelect = (id) => {
    setActiveNoteId(id);
    setNotePreviewVisibility(true);
  };

  const handleNoteAdd = () => {
    const newNote = {
      id: Math.floor(Math.random() * 1000000),
      title: "",
      body: "",
      updated: new Date().toISOString()
    };
    saveNote(newNote);
  };

  const handleNoteEdit = (updatedTitle, updatedBody) => {
    const activeNoteIndex = notes.findIndex(note => note.id === activeNoteId);
    if (activeNoteIndex !== -1) {
      const updatedNote = { ...notes[activeNoteIndex], title: updatedTitle, body: updatedBody };
      saveNote(updatedNote);
    }
  };

  const handleNoteDelete = () => {
    if (activeNoteId) {
      deleteNote(activeNoteId);
    }
  };

  const activeNote = notes.find(note => note.id === activeNoteId);

  return (
    <div className="notes">
      {/* Sidebar component */}
      <div className="notes__sidebar">
        <button className="notes__add" type="button" onClick={handleNoteAdd}>
          Add Note
        </button>
        <div className="notes__list">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`notes__list-item ${
                activeNoteId === note.id ? "notes__list-item--selected" : ""
              }`}
              onClick={() => handleNoteSelect(note.id)}
              onDoubleClick={() => handleNoteDelete(note.id)}
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
      {/* Preview component */}
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
