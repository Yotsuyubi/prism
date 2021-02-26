import { Router } from 'express'
import { Collection, Cue } from '../db'
import axios from 'axios'
import * as Minio from 'minio'

const minioClient = new Minio.Client({
    endPoint: String(process.env.MINIO_HOST),
    port: Number(process.env.MINIO_PORT),
    useSSL: false,
    accessKey: String(process.env.MINIO_ACCESS_KEY),
    secretKey: String(process.env.MINIO_SECRET_KEY)
});


const router: Router = Router()


router.use('/collections/:id/*', async (req, res, next) => {
  try {
    if (!await Collection.exists({ _id: req.params.id }))
    {
      res.status(404).json({ 'msg': 'id not found.' })
    }
    else {
      next()
    }
  }
  catch(err) {
    res.status(500).json({ 'msg': err })
  }
})


router.get('/collections', async (_req, res, _next) => {
  const items = await Collection.findAll()
  res.json(items)
})

router.get('/collections/:id/status', async (req, res, _next) => {
  const id = req.params.id
  const item = await Collection.findById(id)
  res.json(item)
})

router.get('/collections/:id/zip', async (req, res, _next) => {

  const id = req.params.id

  minioClient.getObject(String(process.env.MINIO_BUCKET), id, function(err, dataStream) {

    if (err) {
      res.status(500).json({
        "msg": err
      })
    }

    dataStream.pipe(res)

  })

})


router.put('/collections/:id/processing', async (req, res, _next) => {

  const id = req.params.id
  await Collection.processing(id)
  res.status(200).json({
    "msg": "ok"
  })

})

router.put('/collections/:id/finished', async (req, res, _next) => {

  const id = req.params.id
  await Collection.finished(id)
  res.status(200).json({
    "msg": "ok"
  })

})



router.post('/collections/:ytid', async (req, res, _next) => {

  const ytid = req.params.ytid

  if (await Collection.exists({ ytid })) {
    const doc = await Collection.find({ ytid })
    res.json({
      "msg": "already exist.",
      "_id": doc[0]._id
    })
  }

  else {
    try {
      const videoInfo = await axios.get(`http://${process.env.APIHOST}:${process.env.APIPORT}/${ytid}/info`)
      const id = await Collection.addByYtid(ytid, videoInfo.data.title)
      await Cue.push(id)
      res.json({ id })
    }
    catch(err) {
      res.json({
        "msg": "no video found."
      })
    }
  }

})



export { router as collections }
