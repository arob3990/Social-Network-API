const { Schema, model } = require('mongoose');

// Schema for wat makes up a user
const userSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        trim: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ 
    },
    thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thought' }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
},
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

// Create a virtual property `commentCount` that gets the amount of comments per post
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
  });
  
  // Initialize our User model
  const User = model('User', userSchema);
  
  module.exports = User;
