const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const badId = "5871dda29faedc3491ff93bb";

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("Routing tests", () => {
    const testBook = {
      _id: null,
      title: "Test",
      comments: [],
    };

    suite(
      "POST /api/books with title => create book object/expect book object",
      () => {
        test("Test POST /api/books with title", (done) => {
          chai
            .request(server)
            .keepOpen()
            .post("/api/books")
            .send({ title: "title" })
            .end((err, res) => {
              testBook._id = res.body._id;
              assert.equal(res.status, 200);
              assert.equal(res.body.title, "title");
              done();
            });
        });
        test("Test POST /api/books with no title given", (done) => {
          chai
            .request(server)
            .keepOpen()
            .post("/api/books")
            .send({ title: "" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", () => {
      test("Test GET /api/books", (done) => {
        chai
          .request(server)
          .keepOpen()
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", () => {
      test("Test GET /api/books/[id] with id not in db", (done) => {
        chai
          .request(server)
          .keepOpen()
          .get("/api/books/" + badId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
      test("Test GET /api/books/[id] with valid id in db", (done) => {
        const id = testBook._id;
        chai
          .request(server)
          .keepOpen()
          .get("/api/books/" + id)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "_id", "Book should contain _id");
            assert.property(res.body, "title", "Book should contain title");
            assert.property(
              res.body,
              "comments",
              "Book should contain comments array"
            );
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      () => {
        test("Test POST /api/books/[id] with comment", (done) => {
          const id = testBook._id;
          chai
            .request(server)
            .keepOpen()
            .post("/api/books/" + id)
            .send({ comment: "comment" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.property(res.body, "_id", "Book should contain _id");
              assert.property(res.body, "title", "Book should contain title");
              assert.property(
                res.body,
                "comments",
                "Book should contain comments array"
              );
              done();
            });
        });
        test("Test POST /api/books/[id] without comment field", (done) => {
          const id = testBook._id;
          chai
            .request(server)
            .keepOpen()
            .post("/api/books/" + id)
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field comment");
              done();
            });
        });
        test("Test POST /api/books/[id] with comment, id not in db", (done) => {
          chai
            .request(server)
            .keepOpen()
            .post("/api/books/" + badId)
            .send({ comment: "comment" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", () => {
      test("Test DELETE /api/books/[id] with valid id in db", (done) => {
        const id = testBook._id;
        chai
          .request(server)
          .keepOpen()
          .delete("/api/books/" + id)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful");
            done();
          });
      });
      test("Test DELETE /api/books/[id] with  id not in db", (done) => {
        chai
          .request(server)
          .keepOpen()
          .delete("/api/books/" + badId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
    });
  });
});
