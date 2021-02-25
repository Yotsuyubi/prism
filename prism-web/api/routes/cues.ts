import { Router } from 'express'
import { Cue } from '../db'


const router: Router = Router()


router.get('/cues', async (_req, res, _next) => {
  const items = await Cue.findAll()
  res.json(items)
})

router.get('/cues/pull', async (_req, res, _next) => {
  const item = await Cue.pull()
  res.json(item)
})


export { router as cues }
