package com.thevirtugroup.postitnote.repository;

import com.thevirtugroup.postitnote.model.Note;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class NoteRepository {
    private List<Note> notes;

    NoteRepository() {
        notes = new ArrayList<>();
    }

    public List<Note> getAll() {
        return notes;
    }
    public Note save(Note note) {
        notes.add(note);
        return note;
    }

    public Note getById(int id) {
        return notes.stream().filter(n -> n.getId() == id).findFirst().orElse(null);
    }

    public Note update(int id, Note note) {
        notes.set(notes.indexOf(note), note);
        return note;
    }

    public void delete(Note note) {
        notes.remove(notes.indexOf(note));
    }
}
