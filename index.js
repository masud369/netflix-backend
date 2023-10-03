const express = require("express");
var cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
var bodyParser = require("body-parser");
require('dotenv').config();
const uri = `mongodb+srv://${process.env.UNAME}:${process.env.PASSWORD}@cluster0.kz5wbn2.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;


const app = express();
app.use(bodyParser.json());
app.use(cors());

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const appointmentCollections = client.db(`${process.env.DBNAME}`).collection("users");
  console.log("database connected properly");
  app.post("/abc", (req, res) => {
    const { email, data } = req.body;
    const user = appointmentCollections.findOne({ email }).then((res) => {
      if (res) {
        const { likedMovies } = res;
        console.log(likedMovies);
        // const monvieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);
        const monvieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);
        console.log(monvieAlreadyLiked);
        if (!monvieAlreadyLiked) {
          likedMovies.push(data);
          try {
            appointmentCollections.updateOne(
              { _id: res._id },
              { $set: { likedMovies: [...likedMovies] } }
            );
          } catch (e) {
            console.log(e);
          }
        } else {
          console.log("this movie shoulde't be added");
        }
      } else {
        appointmentCollections.insertOne({ email, likedMovies: [data] });
      }
    });

    // }else return res.json({mag:"movie already added to the like list."})
  });

  app.get("/liked/movie", (req, res) => {
    const { email } = req.query;
    const user = appointmentCollections.find({ email });
      console.log(user)
    });
  
  app.delete("/delete", (req, res) => {
    const { mid } = req.query;
    console.log(mid);
    appointmentCollections.find({}).toArray((err, user) => {
      const { likedMovies } = user[0];
      // const removalMovie = likedMovies.map(({id})=>id===mid);
      likedMovies.map((likedMovie) => {
        const idc = String(likedMovie.id);
        if(idc===mid){
        try {
          likedMovies.deleteOne(
            { idc : mid }
          );
        } catch (e) {
          console.log(e);
        }
        }
        console.log(typeof(idc));
        // ok ? console.log("works") : console.log("not works");
      });
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
