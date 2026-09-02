import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Query,
    UsePipes,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task, TaskDocument } from './task.entity';
import { ZodValidationPipe } from 'src/core/pipes/validation.pipe';
import * as taskSchema from './task.schema';

@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

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
    @UsePipes(new ZodValidationPipe<taskSchema.CreateTaskDto>(taskSchema.createTaskSchema))
    async create(@Body() task: taskSchema.CreateTaskDto): Promise<TaskDocument> {
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
