import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ECurrentStatus, ETaskType, ETimeZone } from './task.interface';

export class CreateTaskSwaggerDto {
  @ApiProperty({
    description: 'Unique name of the task',
    example: 'daily-report-cron',
    minLength: 3,
  })
  name: string;

  @ApiProperty({
    description: 'Log message or payload executed by the task',
    example: 'Generating daily analytics report',
  })
  message: string;

  @ApiProperty({
    description: 'Type of task to schedule',
    enum: ETaskType,
    example: ETaskType.cron,
  })
  taskType: ETaskType;

  @ApiPropertyOptional({
    description: 'Cron expression (required if taskType is cron)',
    example: '0 0 * * *',
  })
  cronExpression?: string;

  @ApiPropertyOptional({
    description: 'Timezone for cron execution',
    enum: ETimeZone,
    example: ETimeZone.IN,
    default: ETimeZone.IN,
  })
  timeZone?: ETimeZone;

  @ApiPropertyOptional({
    description: 'Interval in milliseconds (required if taskType is interval)',
    example: 5000,
  })
  intervalInMs?: number;

  @ApiPropertyOptional({
    description: 'Timeout delay in milliseconds (required if taskType is timeout)',
    example: 10000,
  })
  timeoutInMs?: number;

  @ApiPropertyOptional({
    description: 'Initial task status',
    enum: [ECurrentStatus.active],
    default: ECurrentStatus.active,
  })
  status?: ECurrentStatus.active;
}

export class UpdateTaskSwaggerDto {
  @ApiProperty({
    description: 'Database ID of the task to update',
    example: '665893abc921470ef4801123',
  })
  _id: string;

  @ApiPropertyOptional({
    description: 'Updated name of the task',
    example: 'updated-daily-report-cron',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Updated log message',
    example: 'Updated analytics report task',
  })
  message?: string;

  @ApiPropertyOptional({
    description: 'Updated status of the task',
    enum: ECurrentStatus,
    example: ECurrentStatus.active,
  })
  status?: ECurrentStatus;

  @ApiPropertyOptional({
    description: 'Updated task type',
    enum: ETaskType,
    example: ETaskType.cron,
  })
  taskType?: ETaskType;

  @ApiPropertyOptional({
    description: 'Updated cron expression',
    example: '*/10 * * * * *',
  })
  cronExpression?: string;

  @ApiPropertyOptional({
    description: 'Updated timezone',
    enum: ETimeZone,
    example: ETimeZone.IN,
  })
  timeZone?: ETimeZone;

  @ApiPropertyOptional({
    description: 'Updated interval in milliseconds',
    example: 10000,
  })
  intervalInMs?: number;

  @ApiPropertyOptional({
    description: 'Updated timeout in milliseconds',
    example: 15000,
  })
  timeoutInMs?: number;
}

export class GetAllTaskSwaggerDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    default: 10,
  })
  limit?: number;

  @ApiPropertyOptional({
    description: 'Search string matching task name or message',
    example: 'daily',
  })
  search?: string;
}

export class TaskResponseDto {
  @ApiProperty({ example: '665893abc921470ef4801123' })
  _id: string;

  @ApiProperty({ example: 'daily-report-cron' })
  name: string;

  @ApiProperty({ enum: ETaskType, example: ETaskType.cron })
  taskType: ETaskType;

  @ApiProperty({ enum: ETimeZone, example: ETimeZone.IN })
  timeZone: ETimeZone;

  @ApiPropertyOptional({ example: '0 0 * * *' })
  cronExpression?: string;

  @ApiPropertyOptional({ example: 5000 })
  intervalInMs?: number;

  @ApiPropertyOptional({ example: 10000 })
  timeoutInMs?: number;

  @ApiProperty({ example: 'Generating daily analytics report' })
  message: string;

  @ApiProperty({ enum: ECurrentStatus, example: ECurrentStatus.active })
  status: ECurrentStatus;

  @ApiProperty({ example: '2026-09-02T07:15:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-09-02T07:15:00.000Z' })
  updatedAt: string;
}

export class PaginatedTaskResponseDto {
  @ApiProperty({ type: [TaskResponseDto] })
  data: TaskResponseDto[];

  @ApiProperty({ example: 1 })
  total: number;
}
