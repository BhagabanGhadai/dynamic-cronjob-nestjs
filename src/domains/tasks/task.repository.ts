import { Injectable } from '@nestjs/common';
import { Task, TaskDocument } from './task.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, ProjectionType, QueryOptions } from 'mongoose';
import { ECurrentStatus } from './task.interface';
import { UpdateTaskDto } from './task.schema';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async findById(id: string): Promise<TaskDocument | null> {
    return this.taskModel.findById(id).exec();
  }

  async findAll(
    filter: QueryFilter<Task> = {},
    projection: ProjectionType<TaskDocument> | null = null,
    options: QueryOptions<TaskDocument> = {},
  ): Promise<TaskDocument[]> {
    return this.taskModel.find(filter, projection, options).exec();
  }

  async findAllPaginated(
    params: { page?: number; limit?: number; search?: string } = {},
  ): Promise<{ data: TaskDocument[]; total: number }> {
    const { page = 1, limit = 10, search } = params;
    const filter: QueryFilter<Task> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      this.taskModel.find(filter).skip(skip).limit(limitNum).exec(),
      this.taskModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  async findActiveTasks(): Promise<TaskDocument[]> {
    return this.taskModel.find({ status: ECurrentStatus.active }).exec();
  }

  async create(data: Partial<Task>): Promise<TaskDocument> {
    const task = new this.taskModel(data);
    return task.save();
  }

  async update(data: Partial<UpdateTaskDto>): Promise<TaskDocument | null> {
    return this.taskModel
      .findByIdAndUpdate(data._id, data, { new: true })
      .exec();
  }

  async softDelete(id: string): Promise<TaskDocument | null> {
    return this.taskModel
      .findByIdAndUpdate(id, { status: ECurrentStatus.delete }, { new: true })
      .exec();
  }
}
