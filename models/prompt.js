import { Schema, model, models } from 'mongoose';

const LikesSchema = new Schema({
  likedBy: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  count: {
    type: Number,
    default: 0,
  },
});

const PromptSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  prompt: {
    type: String,
    required: [true, 'Please provide a prompt'],
  },
  tag: {
    type: String,
    required: [true, 'Please provide a tag'],
  },
  likes: {
    type: LikesSchema,
    default: () => ({}),
  },
});

const Prompt = models.Prompt || model('Prompt', PromptSchema);

export default Prompt;
