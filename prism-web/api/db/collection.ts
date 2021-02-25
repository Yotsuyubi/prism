import mongoose from 'mongoose'
const Schema = mongoose.Schema

interface CollectionDocInterface extends mongoose.Document {
  ytid: string;
  title: string;
  storage: string;
  inCue: boolean;
  data: Date;
}

const CollectionSchema = new Schema<CollectionDocInterface>({
  ytid: { type: String, required: true },
  title: { type: String, required: true },
  storage: { type: String },
  inCue: { type: Boolean, default: true },
  date: { type: Date, default: Date.now }
})


CollectionSchema.static('findAll', function() { return this.find({}) })

CollectionSchema.static('addByYtid', async function(ytid: string, title: string) {
  const res = await this.create({ ytid, title })
  return res._id
})


interface CollectionInterface extends mongoose.Model<CollectionDocInterface> {
  findAll(): Promise<CollectionDocInterface>;
  addByYtid(ytid: string, title: string): Promise<string>;
}


export { CollectionSchema, CollectionInterface, CollectionDocInterface }
