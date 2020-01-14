const express = require('express');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

// Public directory setup
app.use(express.static(publicDirectoryPath));


app.get('/', (req, res) => {
    res.render('index');
});


app.listen(port, () => {
   console.log(`Server is up and running on port ${port}.`);
});
