import express from 'express'
import { collections } from './routes/collections'
import { cues } from './routes/cues'

const app: express.Express = express()

app.use(collections)
app.use(cues)


module.exports = app


// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`)
  })
}
