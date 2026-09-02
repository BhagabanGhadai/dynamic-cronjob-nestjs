import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
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
import {
  CreateTaskSwaggerDto,
  UpdateTaskSwaggerDto,
  GetAllTaskSwaggerDto,
  PaginatedTaskResponseDto,
  TaskResponseDto,
} from './task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated list of tasks' })
  @ApiBody({ type: GetAllTaskSwaggerDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'List of tasks retrieved successfully',
    type: PaginatedTaskResponseDto,
  })
  @UsePipes(new ZodValidationPipe(getAllTaskSchema))
  async findAll(
    @Body() body: GetAllTaskSchema,
  ): Promise<{ data: TaskDocument[]; total: number }> {
    return this.taskService.findAll(body);
  }

  @Get(':_id')
  @ApiOperation({ summary: 'Get a task by its ID' })
  @ApiParam({
    name: '_id',
    description: 'MongoDB ObjectId of the task',
    example: '665893abc921470ef4801123',
  })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @UsePipes(new ZodValidationPipe(idSchema))
  async findById(@Param('_id') _id: string): Promise<TaskDocument> {
    return this.taskService.findById(_id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create and schedule a new task (cron, interval, or timeout)',
  })
  @ApiBody({ type: CreateTaskSwaggerDto })
  @ApiResponse({
    status: 201,
    description: 'Task created and scheduled successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error in request payload',
  })
  @UsePipes(new ZodValidationPipe<CreateTaskDto>(createTaskSchema))
  async create(@Body() task: CreateTaskDto): Promise<TaskDocument> {
    return this.taskService.create(task);
  }

  @Patch()
  @ApiOperation({ summary: 'Update an existing task and reschedule it' })
  @ApiBody({ type: UpdateTaskSwaggerDto })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @UsePipes(new ZodValidationPipe<UpdateTaskDto>(updateTaskSchema))
  async update(@Body() task: UpdateTaskDto): Promise<TaskDocument> {
    return this.taskService.update(task);
  }

  @Delete(':_id')
  @ApiOperation({ summary: 'Soft delete a task and stop its running schedule' })
  @ApiParam({
    name: '_id',
    description: 'MongoDB ObjectId of the task to delete',
    example: '665893abc921470ef4801123',
  })
  @ApiResponse({
    status: 200,
    description: 'Task deleted and removed from scheduler successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @UsePipes(new ZodValidationPipe(idSchema))
  async delete(@Param('_id') _id: string): Promise<TaskDocument> {
    return this.taskService.softDelete(_id);
  }
}
