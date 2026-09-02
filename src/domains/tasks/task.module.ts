import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './task.entity';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';
import { TaskHelper } from './task.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository, TaskHelper],
  exports: [TaskService, TaskRepository],
})
export class TaskModule {}
