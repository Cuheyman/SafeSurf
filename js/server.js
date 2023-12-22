const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json()); 

const mongoUri = 'mongodb://localhost:27017'; 
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/report', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('fetchapi'); 
        const reports = database.collection('Sites');

        const report = req.body;
        const result = await reports.insertOne(report);

        res.status(200).json({ message: 'Report received', id: result.insertedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error reporting the website' });
    } finally {
        await client.close();
    }
});

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
