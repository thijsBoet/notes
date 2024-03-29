import React, {useEffect, useState} from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Split from 'react-split';
import { nanoid } from 'nanoid';

const App = () => {
	const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('notes')) || []);

	const [currentNoteId, setCurrentNoteId] = useState((notes[0] && notes[0].id) || '');

	useEffect(() => localStorage.setItem('notes', JSON.stringify(notes)), [notes]);

	const createNewNote = () => {
		const newNote = {
			id: nanoid(),
			body: "# Type your markdown note's title here",
		};
		setNotes(prevNotes => [newNote, ...prevNotes]);
		setCurrentNoteId(newNote.id);
	}

	const updateNote = text => {
		setNotes(oldNotes => {
			const newArray = [];
			oldNotes.forEach(oldNote => {
				oldNote.id === currentNoteId ? newArray.unshift({ ...oldNote, body: text }) : newArray.push(oldNote);
			});
			return newArray;
		});
	}

	const deleteNote = (event, noteId) => {
		event.stopPropagation();
		setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId));
	}

	const findCurrentNote = () => notes.find(note => note.id === currentNoteId) || notes[0];

	return (
		<main>
			{notes.length > 0 ? (
				<Split sizes={[30, 70]} direction='horizontal' className='split'>
					<Sidebar
						notes={notes}
						currentNote={findCurrentNote()}
						setCurrentNoteId={setCurrentNoteId}
						newNote={createNewNote}
						deleteNote={deleteNote}
					/>
					{currentNoteId && notes.length > 0 && (
						<Editor currentNote={findCurrentNote()} updateNote={updateNote} />
					)}
				</Split>
			) : (
				<div className='no-notes'>
					<h1>You have no notes</h1>
					<button className='first-note' onClick={createNewNote}>
						Create one now
					</button>
				</div>
			)}
		</main>
	);
}

export default App;