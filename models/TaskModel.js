import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  projecttitle: {
    type: String,
    required: true,
  },
  taskname: String,
  description: String,

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  status: {
    type: String,
    enum: ['InProgress', 'Pending', 'Completed', 'OnHold', 'Cancelled'],
    default: 'Pending',
  },

  dueDate: {
    type: Date,
    required: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
