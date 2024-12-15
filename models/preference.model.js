const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferencesSchema = new Schema({
  shareEmail: {
    type: Boolean,
    required: true,
    default: false, 
  },
  shareContactNumber: {
    type: Boolean,
    required: true,
    default: false,  
  },
  shareAddress: {
    type: Boolean,
    required: true,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true, 
});


const Preferences = mongoose.model('Preferences', preferencesSchema);
module.exports = Preferences;
