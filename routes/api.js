const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [String],
  commentcount: { type: Number, default: 0 },
});

const Book = mongoose.model("Book", bookSchema);

("use strict");

module.exports = (app) => {
  app
    .route("/api/books")
    .get(async (req, res) => {
      try {
        const response = await Book.find().select("_id title commentcount");
        res.json(response);
      } catch (err) {
        console.error(err);
      }
    })

    .post(async (req, res) => {
      try {
        const title = req.body.title;
        if (!title) return res.send("missing required field title");

        const response = await Book.create({ title });
        res.json(response);
      } catch (err) {
        console.error(err);
      }
    })

    .delete(async (req, res) => {
      try {
        await Book.deleteMany();
        res.send("complete delete successful");
      } catch (err) {
        console.error(err);
      }
    });

  app
    .route("/api/books/:id")
    .get(async (req, res) => {
      try {
        const _id = req.params.id;
        const response = await Book.findById(_id).select("_id title comments");
        if (!response) return res.send("no book exists");
        res.json(response);
      } catch (err) {
        console.error(err);
      }
    })

    .post(async (req, res) => {
      try {
        const comment = req.body.comment;
        if (!comment) return res.send("missing required field comment");
        const bookid = req.params.id;
        const searchRes = await Book.findById(bookid);
        if (!searchRes) return res.send("no book exists");
        const updatedBook = await Book.findByIdAndUpdate(
          bookid,
          {
            $push: { comments: comment },
            $inc: { commentcount: 1 },
          },
          { new: 1 }
        );
        res.json(updatedBook);
      } catch (err) {
        console.error(err);
      }
    })

    .delete(async (req, res) => {
      try {
        const bookid = req.params.id;
        const response = await Book.findByIdAndDelete(bookid);
        if (!response) return res.send("no book exists");
        res.send("delete successful");
      } catch (err) {
        console.error(err);
      }
    });
};
