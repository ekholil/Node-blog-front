const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const port = 5000;
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello From server')
})
app.listen(port, () => {
    console.log('server is running at ', port)
})


const uri = "mongodb+srv://userno1:17U5aMZ8MoFe1ZaC@cluster0.odpvs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const blogCollection = client.db("blog").collection("blogs");
    
      app.get('/blogs', async(req, res) => {
        const result = await blogCollection.find({}).toArray()
        res.send(result) 
      })

      
      app.get('/blogs/:id', async(req, res) => {
        const id = req.params.id
        const query = {_id : ObjectId(id)}
        const blog = await blogCollection.findOne(query)
        res.send(blog)
      })
      
      //post api
      app.post('/blogs', async(req, res) => {
        const blog = req.body;
        const result = await blogCollection.insertOne(blog)
        res.json(result)
      })
      // delete api
      app.delete('/blogs/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id : ObjectId(id)}
        const result = await blogCollection.deleteOne(query)
        res.json(result)
      })
      // update
      app.put('/blogs/:id', async(req, res) => {
        const id = req.params.id;
        const updatedblog = req.body;
        const filter = {_id : ObjectId(id)}
        const options = { upsert: true };
        // create a document that sets the plot of the movie
        const updateDoc = {
          $set: {
            name: updatedblog.name,
            img: updatedblog.img,
            instructor: updatedblog.instructor,
            blog: updatedblog.blog
          },
        };
        const result = await blogCollection.updateOne(filter, updateDoc, options)
        console.log('upadating user ', id)
        res.send(result)
        
      })
      
    } finally {
    
    }
  }
  run().catch(console.dir);
