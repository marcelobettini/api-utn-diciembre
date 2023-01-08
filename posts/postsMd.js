const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    date: { type: Date, default: Date.now },
    comments: [{ body: String, date: Date }],
    hidden: { type: Boolean, default: false },
    meta: {
      votes: Number,
      favs: Number,
    },
  },
  { timestamps: true }
);

PostSchema.index({ title: "text" });
/* 
crea un índice para "find by title" Esto podría funcionar en -> posts/find/:query -> http://localhost.../find/title=algo
*/

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
