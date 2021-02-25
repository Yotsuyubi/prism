import { Router } from 'express'
import { Collection, Cue } from '../db'
import axios from 'axios'


const router: Router = Router()


router.get('/collections', async (_req, res, _next) => {
  const items = await Collection.findAll()
  res.json(items)
})

router.get('/collections/:id/status', async (req, res, _next) => {
  const id = req.params.id
  const item = await Collection.findById(id)
  res.json(item)
})

// router.get('/collections/:id/separate', async (req, res, _next) => {
//   const id = req.params.id
//   const docs = await Collection.findById(id)
//   if (!docs) {
//     res.json({
//       "msg": "not found."
//     })
//   }
//   else {
//     try {
//       const response = await axios.post(
//         `http://${process.env.APIHOST}:${process.env.APIPORT}/separate/${docs.ytid}`,
//         { },
//         {
//           responseType: 'arraybuffer',
//           headers: { Accept: 'application/zip' },
//           timeout: 1000 * 60 * 10 // 10 min.
//         }
//       )
//       res.set('Content-Type', 'application/zip')
//       res.send(response.data)
//     }
//     catch(err) {
//       res.json({
//         "msg": "some error occued."
//       })
//     }
//   }
// })

// router.get('/collections/:id/zip', async (req, res, _next) => {
//   const id = req.params.id
//   // TODO: response zip
// })



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
