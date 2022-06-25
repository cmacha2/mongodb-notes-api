const Note = require('../models/Note');
const User = require('../models/User');

const noteRouter =  require('express').Router()


noteRouter.get("/", (req, res, next) => {
  Note.find({}).populate("user",{
    username:1,
    name:1
  })
    .then((result) => res.json(result))
    .catch((error) => next(error));
});

noteRouter.post("/", async (req, res, next) => {
  const {content,important = false, userId} = req.body;
  console.log(req.body)

  const user = await User.findById(userId)

  if (!content) {
    return res.status(400).json({ error: 'requiered "content" field missing' });
  }

  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user:user._id
  });

  try {
  const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)

    await user.save()

    res.json(savedNote)
  } catch (error) {
    next(error)
  }
});

noteRouter.get("/:id", (req, res, next) => {
  const { id } = req.params;

  Note.findById(id)
    .then((note) => {
      return note
        ? res.json(note)
        : res.status(400).json({ error: "id used is malformed" }).end();
    })
    .catch((error) => next(error));
});

noteRouter.delete("/:id", (req, res, next) => {
  const { id } = req.params;

  Note.findByIdAndDelete(id)
    .then((note) => {
      return note
        ? res.status(204).end()
        : res.status(400).json({ error: "id used is malformed" }).end();
    })
    .catch((error) => next(error));
});

noteRouter.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const note = req.body;

  const newNoteInfo = {
    content: note.content,
    important: note.important,
  };

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true }) //=> devuelve por defecto el valor que encontro no el actualizado
    .then((noteUpdate) => {
      res.json(noteUpdate);
    })
    .catch((error) => next(error));
});


module.exports = noteRouter