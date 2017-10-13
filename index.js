
const express = require('express')

let app = express()
app.use(express.static(__dirname))

const port = process.env.PORT || 8000
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
