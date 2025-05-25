import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function App() {
  const [notes, setNotes] = useState([]);
  const [currentLine, setCurrentLine] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [board, setBoard] = useState({
    'To Do': ['Sample Task 1', 'Sample Task 2'],
    'In Progress': ['Working on feature'],
    'Done': ['Completed task'],
  });

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentLine.trim() !== '') {
      const timestamp = new Date().toLocaleString();
      setNotes([...notes, { text: currentLine, time: timestamp }]);
      setCurrentLine('');
      e.preventDefault();
    }
  };

  const handleNoteChange = (index, newText) => {
    const updated = [...notes];
    updated[index].text = newText;
    setNotes(updated);
  };

  const deleteNote = (index) => {
    const updated = [...notes];
    updated.splice(index, 1);
    setNotes(updated);
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const sourceTasks = Array.from(board[sourceCol]);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    const destTasks = Array.from(board[destCol]);
    destTasks.splice(destination.index, 0, movedTask);

    setBoard({
      ...board,
      [sourceCol]: sourceTasks,
      [destCol]: destTasks,
    });
  };

  const updateCard = (col, idx, newText) => {
    const updatedCol = [...board[col]];
    updatedCol[idx] = newText;
    setBoard({ ...board, [col]: updatedCol });
  };

  return (
    <div className={`vh-100 d-flex flex-column ${darkMode ? 'bg-dark text-light' : 'bg-white text-dark'}`}>
      <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
        <h5 className="m-0">📝 Daily Notes</h5>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setDarkMode(!darkMode)}
        >
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      {/* Trello Board */}
      <div className="flex-grow-0" style={{ height: '20%' }}>
        <div className="container-fluid p-2 h-100 overflow-auto">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="row h-100">
              {Object.keys(board).map((col, colIdx) => (
                <div key={colIdx} className="col">
                  <div className={`rounded p-2 h-100 ${darkMode ? 'bg-secondary text-light' : 'bg-light'}`}>
                    <h6 className="text-center">{col}</h6>
                    <Droppable droppableId={col}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{ minHeight: '100px' }}
                        >
                          {board[col].map((task, i) => (
                            <Draggable key={`${col}-${i}`} draggableId={`${col}-${i}`} index={i}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`card mb-2 p-2 ${darkMode ? 'bg-dark text-white' : ''}`}
                                >
                                  <textarea
                                    className={`form-control ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}
                                    value={task}
                                    onChange={(e) => updateCard(col, i, e.target.value)}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      {/* Note Area */}
      <div className="flex-grow-1 border-top position-relative overflow-auto">
        <div className="container py-3">
          <div className="notebook">
            {notes.map((note, index) => (
              <div key={index} className="d-flex align-items-start mb-2 border-bottom pb-1">
                <div className="small text-muted me-2" style={{ width: '160px' }}>
                  {note.time}
                </div>
                <textarea
                  className={`form-control me-2 ${darkMode ? 'bg-dark text-light' : 'bg-transparent text-dark'} border-0`}
                  rows="1"
                  value={note.text}
                  onChange={(e) => handleNoteChange(index, e.target.value)}
                  style={{ resize: 'none', borderRadius: 0, lineHeight: '1.5em' }}
                />
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteNote(index)}
                >
                  🗑
                </button>
              </div>
            ))}
            <div className="d-flex align-items-start">
              <div className="small text-muted me-2" style={{ width: '160px' }}>
                {currentLine ? new Date().toLocaleString() : ''}
              </div>
              <textarea
                className={`form-control ${darkMode ? 'bg-dark text-light' : ''} border-0 border-bottom`}
                rows="1"
                placeholder="Type a note and hit Enter..."
                value={currentLine}
                onChange={(e) => setCurrentLine(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  resize: 'none',
                  borderRadius: 0,
                  lineHeight: '1.5em',
                  paddingTop: 0,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
