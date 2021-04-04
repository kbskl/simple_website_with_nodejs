const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false

}).then(() => console.log('Mongo connection successful')).catch(err => console.log(err))