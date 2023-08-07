const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname +'/date.js');
const app=express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});
const listSchema={
  name:String
};
const List = mongoose.model("List",listSchema);
const list1= new List({
  name:"Create a new List"
});
const list2= new List({
  name:"Delete The Old LIst"
});

let items=[list1,list2];
const itemSchema={
  name:String,
  items:[listSchema]
};
const Item= mongoose.model("item", itemSchema);


app.get("/", function(req,res){
  let currentDay=date.getDate();
  List.find({}).then(function(foundItems){
    if(foundItems.length ===0){
      List.insertMany(items).then(function(err){
        if(err){
          console.log(err);
        }else {
          console.log("Saved the defualt items to db");
        }
      });
      res.redirect("/");
    }else {
        res.render('list', {kindOfDay:currentDay, addItems:foundItems});
    }
    })
    .catch(function(err){
      console.log(err);
    });
  })

app.post("/", function(req, res){
  const itemName= req.body.newItem;
  let listName = req.body.button;
  const item =new List({
    name:itemName
  });
    item.save();
    res.redirect("/");

});
app.post("/delete", function(req, res){
  const check=req.body.checkBox;
  List.findByIdAndRemove(check).then(function(err){
    if(!err){
    }
    res.redirect("/");
  });
})

app.listen(5000,()=>{
    console.log("Server is running on 5000 port");
})
