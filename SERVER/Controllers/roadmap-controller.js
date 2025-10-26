/* 
- Create a roadmap
- Get a roadmap
- Delete a roadmap
- Get all roadmaps
*/
import Roadmap from "../Models/roadmap.js";
import mongoose from "mongoose";

// Create a new roadmap
exports.createRoadmap = async (req, res) => {
    const { title, description, userId } = req.body;
    const newRoadmap = new Roadmap({ title, description, userId });
    await newRoadmap.save();
    res.status(201).json(newRoadmap);
}

// Get a roadmap
exports.getRoadmap = async (req, res) => {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
        return res.status(404).json({ success: false, message: "Roadmap not found" });
    }
    res.status(200).json(roadmap);
}
// Delete a roadmap
exports.deleteRoadmap = async (req, res) => {
    const roadmap = await Roadmap.findByIdAndDelete(req.params.id);
    if (!roadmap) {
        return res.status(404).json({ success: false, message: "Roadmap not found" });
    }
    res.status(200).json({ success: true, message: "Roadmap deleted successfully" });
}
// Get all roadmaps
exports.getAllRoadmaps = async (req, res) => {
    const roadmaps = await Roadmap.find();
    res.status(200).json(roadmaps);
}

