import mongoose, { Schema, Types } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export interface ISession {
    _id?: string; 
    courseId: Types.UUID,
    userId: Types.UUID,
    totalModulesStudied: number,
    averageScore: number,
    timeStudied: number,
}

const sessionSchema = new Schema<ISession>({
    _id: { type: String, default: uuidv4 }, // Set _id to be a UUID
    courseId: { type: Schema.Types.UUID, required: true},
    userId: { type: Schema.Types.UUID, required: true},
    totalModulesStudied: { type: Schema.Types.Number, required: true},
    averageScore: { type: Schema.Types.Number, required: true, default: 0},
    timeStudied: { type: Schema.Types.Number, required: true}
})

export const Session = mongoose.model<ISession>("Session", sessionSchema)