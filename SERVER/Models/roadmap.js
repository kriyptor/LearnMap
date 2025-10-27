import mongoose from 'mongoose';
import User from './users.js';

// 1. Define the innermost sub-document: ResourceSchema
const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, default: "" }, // Default to empty string if not provided by AI
  type: { 
    type: String, 
    enum: ['video', 'article', 'book', 'other'], // Constrain types for consistency
    required: true 
  },
}, { _id: false }); // We don't need Mongoose to generate an ID for every resource

// 2. Define the Lesson sub-document: LessonSchema
const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, required: true },
  estimatedHours: { type: Number, required: true, min: 0.5, max: 6 },
  
  // *** PROGRESS TRACKING FIELD ***
  isCompleted: { type: Boolean, default: false }, // New field for user progress
  
  resources: [ResourceSchema],
}, { _id: false });

// 3. Define the Module sub-document: ModuleSchema
const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  order: { type: Number, required: true },
  estimatedHours: { type: Number, required: true }, // Total hours for this module
  lessons: [LessonSchema],
}, { _id: false });

// 4. Define the main Roadmap document: RoadmapSchema
const RoadmapSchema = new mongoose.Schema({
  // *** REQUIRED LINK TO USER ***
 userId: { 
    type: mongoose.Schema.Types.ObjectId, // Link the roadmap to a specific user
    ref: 'User', // Assuming you have a 'User' model
    required: true 
  }, 
  
  // AI Generated Top-Level Fields
  topic: { type: String, required: true },
  shortDescription: { type: String, required: true },
  estimatedTotalHours: { type: Number, required: true },
  tags: [String], // Array of strings

  // The Nested Content
  modules: [ModuleSchema],
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});


// 5. Create and Export the Model
export default mongoose.model('Roadmap', RoadmapSchema);
