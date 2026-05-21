import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';

const mockTask = {
  id: 'task-id',
  title: 'Test Task',
  description: 'Test Description',
  status: TaskStatus.PENDING,
  dueDate: null,
  userId: 'user-id',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrismaService = {
  task: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated tasks for the user', async () => {
      mockPrismaService.task.findMany.mockResolvedValue([mockTask]);
      mockPrismaService.task.count.mockResolvedValue(1);

      const result = await service.findAll('user-id', { page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should filter by status when provided', async () => {
      mockPrismaService.task.findMany.mockResolvedValue([mockTask]);
      mockPrismaService.task.count.mockResolvedValue(1);

      await service.findAll('user-id', { status: TaskStatus.PENDING, page: 1, limit: 10 });

      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-id', status: TaskStatus.PENDING },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return the task if it belongs to the user', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);

      const result = await service.findOne('task-id', 'user-id');
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.findOne('bad-id', 'user-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if task belongs to another user', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue({ ...mockTask, userId: 'other-user' });

      await expect(service.findOne('task-id', 'user-id')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('create', () => {
    it('should create a task and return it', async () => {
      mockPrismaService.task.create.mockResolvedValue(mockTask);

      const result = await service.create('user-id', { title: 'Test Task' });
      expect(result).toEqual(mockTask);
    });
  });

  describe('remove', () => {
    it('should delete the task and return success message', async () => {
      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);
      mockPrismaService.task.delete.mockResolvedValue(mockTask);

      const result = await service.remove('task-id', 'user-id');
      expect(result.message).toBe('Task deleted successfully');
    });
  });
});
