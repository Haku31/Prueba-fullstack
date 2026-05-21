import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks with optional status filter and pagination' })
  findAll(
    @GetUser('id') userId: string,
    @Query() query: QueryTasksDto,
  ) {
    return this.tasksService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.tasksService.findOne(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  create(@GetUser('id') userId: string, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a task' })
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.tasksService.remove(id, userId);
  }
}
