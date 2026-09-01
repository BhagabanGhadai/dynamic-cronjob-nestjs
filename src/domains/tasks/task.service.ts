import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { Task, TaskDocument } from './task.entity';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findById(id: string): Promise<TaskDocument> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async findAll(
    params: { page?: number; limit?: number; search?: string } = {},
  ): Promise<{ data: TaskDocument[]; total: number }> {
    return this.taskRepository.findAllPaginated(params);
  }

  async findActiveTasks(): Promise<TaskDocument[]> {
    return this.taskRepository.findActiveTasks();
  }

  async create(data: Partial<Task>): Promise<TaskDocument> {
    return this.taskRepository.create(data);
  }

  async update(id: string, data: Partial<Task>): Promise<TaskDocument> {
    const updated = await this.taskRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return updated;
  }

  async softDelete(id: string): Promise<TaskDocument> {
    const deleted = await this.taskRepository.softDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return deleted;
  }
}
