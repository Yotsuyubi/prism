import mongoose from 'mongoose'
const Schema = mongoose.Schema

interface CueDocInterface extends mongoose.Document {
  collection_id: string;
}


const CueSchema = new Schema<CueDocInterface>({
  collection_id: { type: String, required: true },
})


CueSchema.static('findAll', function() { return this.find({}) })

CueSchema.static('push', async function(collection_id: string) {
  const res = await this.create({ collection_id })
  return res._id
})

CueSchema.static('pull', async function() {
  const doc = await this.find({})
  if (doc.length < 1) {
    return null
  }
  const { _id, collection_id } = doc[0]
  await this.deleteOne({ _id })
  return collection_id
})


interface CueInterface extends mongoose.Model<CueDocInterface> {
  findAll(): Promise<CueDocInterface>;
  push(collection_id: string): Promise<string>;
  pull(): Promise<string|null>;
}


export { CueSchema, CueInterface, CueDocInterface }
