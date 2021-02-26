import mongoose from 'mongoose'
const Schema = mongoose.Schema

interface CollectionDocInterface extends mongoose.Document {
  ytid: string;
  title: string;
  isFinished: boolean;
  inCue: boolean;
  isProcessing: boolean;
  data: Date;
}

const CollectionSchema = new Schema<CollectionDocInterface>({
  ytid: { type: String, required: true },
  title: { type: String, required: true },
  isFinished: { type: Boolean, default: false },
  inCue: { type: Boolean, default: true },
  isProcessing: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
})


CollectionSchema.static('findAll', function() { return this.find({}) })

CollectionSchema.static('addByYtid', async function(ytid: string, title: string) {
  const res = await this.create({ ytid, title })
  return res._id
})

CollectionSchema.static('processing', async function(_id: string) {
  const doc = await this.findOne({ _id })
  if (!doc) {
    throw Error()
  }
  else {
    doc.isProcessing = true
    doc.inCue = false
    await doc.save()
    return doc._id
  }
})

CollectionSchema.static('finished', async function(_id: string) {
  const doc = await this.findOne({ _id })
  if (!doc) {
    throw Error()
  }
  else {
    doc.isProcessing = false
    doc.isFinished = true
    await doc.save()
    return doc._id
  }
})


interface CollectionInterface extends mongoose.Model<CollectionDocInterface> {
  findAll(): Promise<CollectionDocInterface>;
  addByYtid(ytid: string, title: string): Promise<string>;
  processing(_id: string): Promise<string>;
  finished(_id: string): Promise<string>;
}


export { CollectionSchema, CollectionInterface, CollectionDocInterface }
