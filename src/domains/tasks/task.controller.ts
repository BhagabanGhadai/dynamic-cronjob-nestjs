import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Query,
    UsePipes,
    Patch,
} from '@nestjs/common';
import { TaskService } from './task.service';
import type { TaskDocument } from './task.entity';
import { ZodValidationPipe } from 'src/core/pipes/validation.pipe';
import {
    createTaskSchema,
    updateTaskSchema,
    idSchema,
    getAllTaskSchema,
    type CreateTaskDto,
    type UpdateTaskDto,
    type GetAllTaskSchema,
} from './task.schema';

@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @Get()
    @UsePipes(new ZodValidationPipe(getAllTaskSchema))
    async findAll(
        @Body() body: GetAllTaskSchema
    ): Promise<{ data: TaskDocument[]; total: number }> {
        return this.taskService.findAll(body);
    }

    @Get(':_id')
    @UsePipes(new ZodValidationPipe(idSchema))
    async findById(@Param('_id') _id: string): Promise<TaskDocument> {
        return this.taskService.findById(_id);
    }

    @Post()
    @UsePipes(new ZodValidationPipe<CreateTaskDto>(createTaskSchema))
    async create(@Body() task: CreateTaskDto): Promise<TaskDocument> {
        return this.taskService.create(task);
    }

    @Patch()
    @UsePipes(new ZodValidationPipe<UpdateTaskDto>(updateTaskSchema))
    async update(
        @Body() task: UpdateTaskDto,
    ): Promise<TaskDocument> {
        return this.taskService.update(task);
    }

    @Delete(':_id')
    @UsePipes(new ZodValidationPipe(idSchema))
    async delete(@Param('_id') _id: string): Promise<TaskDocument> {
        return this.taskService.softDelete(_id);
    }
}
