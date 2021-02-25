import mongoose from 'mongoose'
import { CollectionSchema, CollectionInterface, CollectionDocInterface } from './collection'
import { CueSchema, CueInterface, CueDocInterface } from './cue'


mongoose.connect(
  `mongodb://${process.env.DBHOST}:${process.env.DBPORT}/prism`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)

const Collection = mongoose.model<CollectionDocInterface, CollectionInterface>('Collection', CollectionSchema)
const Cue = mongoose.model<CueDocInterface, CueInterface>('Cue', CueSchema)

export { Collection, Cue }
