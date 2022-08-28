const mongoose = require("mongoose")

let cachedConnection = null

if (!cachedConnection) {
    cachedConnection = mongoose.connect(process.env.URL_DATABASE);
}
