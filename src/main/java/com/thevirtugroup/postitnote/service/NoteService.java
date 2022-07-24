package com.thevirtugroup.postitnote.service;

import com.thevirtugroup.postitnote.model.Note;
import com.thevirtugroup.postitnote.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class NoteService {
    @Autowired
    NoteRepository repository;

    public List<Note> getAll() {
        return repository.getAll();
    }
    public Note save(Note note) {
        note.setCurrentTimeDate();
        note.setId();
        return repository.save(note);
    }

    public Note getById(int id) {
        return repository.getById(id);
    }

    public Note update(int id, Note note) {
        Note storedNote = this.getById(id);
        if (storedNote != null) {
            return repository.update(id, note);
        }
        return null;
    }

    public void delete(int id) {
        Note storedNote = this.getById(id);
        if (storedNote != null) {
            repository.delete(storedNote);
        }
    }
}
