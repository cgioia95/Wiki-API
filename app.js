const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get(function(req, res) {

  Article.find(function(err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });

})

.post(function(req, res) {

  const article = new Article({
    title: req.body.title,
    content: req.body.content
  });

  article.save(function(err) {
    if (!err) {
      res.send("Succesffuly sent new article!");
    } else {
      res.send(err);
    }

  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Succesffuly deleted all articles");
    }
    else {
      res.send(err);
    }
  });
});

app.route("/articles/:title")

.get(function(req,res) {
  var title = req.params.title;

  Article.findOne( {title: title}, function(err, article){
    if (article){
      res.send(article);
    } else {
      res.send("No articles matching title found");
    }
  });

} )

.put(function(req,res){
  Article.update(
    {title: req.params.title},
    {title: req.body.title, content:  req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Succesffuly updated article.")
      }
    }
  );
})

.patch(function(req,res){
  Article.update(
    {title: req.params.title},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Succesffuly updated article.");
      } else {
        res.send(err);
      }
});

})

.delete(function(req,res){
      Article.deleteOne({title: req.params.title}, function(err){
        if(!err){
          res.send("Succesffuly deleted the article.");
        }
        else {
          res.send(err);
        }
      });
});

app.listen(3000, function(req, res) {
  console.log("Server running on port 3000");
});
