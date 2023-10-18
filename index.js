const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

// brandShop
// O2wKIYQEaM45eLqQ


const uri = "mongodb+srv://brandShop:O2wKIYQEaM45eLqQ@cluster0.98p3czt.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const productsCollection = client.db('productsDB').collection('products');


        // get data to the database
        app.get('/products', async (req,res)=>{
            const result = await productsCollection.find().toArray();
            res.send(result)
        })

        // find a single data 
        app.get('/products/:id', async (req, res)=>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id)}
            const result = await productsCollection.findOne(query)
            res.send(result)
        })



        // Add product store to the database
        app.post('/products', async (req, res)=>{
            const newProduct = req.body;
            // console.log(newProduct);
            const result = await productsCollection.insertOne(newProduct)
            res.send(result)
        })

        // updated a document 

        app.put("/products/:id", async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            // console.log("id", id, updatedProduct);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            // name, brand, type, price, rating, , photo }

            const product = {
                $set: {

                    name: updatedProduct.name,
                    brand: updatedProduct.brand,
                    type: updatedProduct.type,
                    price: updatedProduct.price,
                    rating: updatedProduct.rating,
                    description: updatedProduct.description,
                    photo: updatedProduct.photo
                },
            };
            const result = await productsCollection.updateOne(
                filter,
                product,
                options
            );
            res.send(result);
        });








        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('brand shop server is running')
})

app.listen(port, () => {
    console.log(`my brand shop is running on PORT: ${port}`);
})