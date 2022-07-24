package com.thevirtugroup.postitnote.rest;

import com.thevirtugroup.postitnote.model.Note;
import com.thevirtugroup.postitnote.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 */
@RestController
@RequestMapping("/api/notes")
public class NoteController {
    @Autowired
    NoteService service;

    @RequestMapping(value = "/", method= RequestMethod.GET)
    public List<Note> getAll() {
        return service.getAll();
    }
    @RequestMapping(value = "/", method= RequestMethod.POST)
    public Note save(@RequestBody Note note) {
        return service.save(note);

    }
    @RequestMapping(value = "/{id}", method= RequestMethod.GET)
    public Note getBydId(@PathVariable int id) {
        return service.getById(id);
    }

    @RequestMapping(value = "/{id}", method= RequestMethod.PUT)
    @ResponseBody
    public Note update(@RequestBody Note note, @PathVariable int id) {
        return service.update(id, note);
    }

    @RequestMapping(value = "/{id}", method= RequestMethod.DELETE)
    @ResponseBody
    public void delete(@PathVariable int id) {
        service.delete(id);
    }
}
