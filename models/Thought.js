const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction')

//Schema to create Thought model
const thoughtSchema = new Schema(
    {
        thoughtText: { 
            type: String, 
            required: true, 
            min: [1, 'Not enough characters'], 
            max: [280, 'Too many characters']
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date) => {
                if (date) return date.toISOString().split("T") [0];
          }
        },
        username: {
            type: String,
            required: true
        }, 
        reactions: [reactionSchema]
    },
    {
        toJSON: {
          getters: true,
        },
        id: false,
      }
);
// Create a virtual property `reactionCount` that gets the amount of comments per post
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
  });
  
  const Thought = model('Thought', thoughtSchema);
  
  module.exports = Thought;