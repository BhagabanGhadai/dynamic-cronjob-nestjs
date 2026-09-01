import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task, TaskDocument } from './task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ): Promise<{ data: TaskDocument[]; total: number }> {
    return this.taskService.findAll({ page, limit, search });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<TaskDocument> {
    return this.taskService.findById(id);
  }

  @Post()
  async create(@Body() task: Task): Promise<TaskDocument> {
    return this.taskService.create(task);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() task: Task,
  ): Promise<TaskDocument> {
    return this.taskService.update(id, task);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<TaskDocument> {
    return this.taskService.softDelete(id);
  }
}
