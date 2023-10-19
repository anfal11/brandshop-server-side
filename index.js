const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

// username  (ratulcse1)
// password (QEdnpEF6Uh1JsXKn)

const uri = "mongodb+srv://ratulcse1:QEdnpEF6Uh1JsXKn@cluster0.ey8cr7h.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    await client.connect();

    const database = client.db("brand").collection("brandCOllection");
    const productCollection = client.db("brand").collection("productCollection");


    // data brand
    app.get('/brand', async (req, res) => {
      const cursor = database.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // add product 
    app.post('/addProduct', async (req, res) => {
      const product = req.body;
      console.log("new product", product);
      const result = await productCollection.insertOne(product);
      res.send(result);

    })

    // all product show
    app.get('/addProduct/', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // to update products
    app.get('/updateProduct/:id', async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ObjectId format" });
      }
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    // brand wise product show
    app.get('/addProduct/:brand', async (req, res) => {
      const brand = req.params.brand;
      const query = { brand: brand };
      const result = await productCollection.find(query).toArray();
      res.send(result);
    })

    // update data

    app.put('/updateProduct/:id', async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedProduct.name,
          type: updatedProduct.type, 
          brand: updatedProduct.brand, 
          price: updatedProduct.price, 
          description: updatedProduct.description, 
          rating: updatedProduct.rating, 
          image: updatedProduct.image,
        },
      };
      const result = await productCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('My Brand shop is rinnging.')
})

app.listen(port, () => {
  console.log(`My Brand shop is rinnging on port ${port}`)
})