import { Injectable } from "@nestjs/common";
import { Task, TaskDocument } from "./task.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ECurrentStatus } from "./task.interface";

@Injectable()
export class TaskRepository {
    constructor(@InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>) { }

    async findById(id: string): Promise<TaskDocument | null> {
        return this.taskModel.findById(id).exec();
    }

    async findAll(filter: any = {}, projection: any = null, options: any = {}): Promise<TaskDocument[]> {
        return this.taskModel.find(filter, projection, options).exec();
    }

    async findActiveTasks(): Promise<TaskDocument[]> {
        return this.taskModel.find({ status: ECurrentStatus.active }).exec();
    }

    async create(data: Partial<Task>): Promise<TaskDocument> {
        const task = new this.taskModel(data);
        return task.save();
    }

    async update(id: string, data: Partial<Task>): Promise<TaskDocument | null> {
        return this.taskModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async softDelete(id: string): Promise<TaskDocument | null> {
        return this.taskModel.findByIdAndUpdate(id, { status: ECurrentStatus.delete }, { new: true }).exec();
    }
}