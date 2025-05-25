import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [currentLine, setCurrentLine] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentLine.trim() !== '') {
      const timestamp = new Date().toLocaleTimeString();
      setNotes([...notes, { text: currentLine, time: timestamp }]);
      setCurrentLine('');
      e.preventDefault();
    }
  };

  return (
    <div class="container-fluid">
    <div className="vh-100 d-flex flex-column">
      {/* Trello board */}
      <div className="flex-grow-0" style={{ height: '20%' }}>
        <div className="container-fluid bg-light p-2 h-100 overflow-auto">
          <div className="row h-100">
            {['To Do', 'In Progress', 'Done'].map((col, i) => (
              <div key={i} className="col">
                <div className="bg-white border rounded p-2 h-100">
                  <h6 className="text-center">{col}</h6>
                  <div className="card mb-2 p-2">Sample Task 1</div>
                  <div className="card mb-2 p-2">Sample Task 2</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Note-taking area */}
      <div className="flex-grow-1 bg-white border-top position-relative overflow-auto">
        <div className="container py-3">
          <div className="notebook">
            {notes.map((note, index) => (
              <div key={index} className="d-flex mb-1 border-bottom pb-1">
                <div className="text-muted small me-2" style={{ width: '80px' }}>
                  {note.time}
                </div>
                <div>{note.text}</div>
              </div>
            ))}
            <div className="d-flex">
              <div className="text-muted small me-2" style={{ width: '80px' }}>
                {currentLine ? new Date().toLocaleTimeString() : ''}
              </div>
              <textarea
                className="form-control border-0 border-bottom"
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
    </div>
  );
}

export default App;
