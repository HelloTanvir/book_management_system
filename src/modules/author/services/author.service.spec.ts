import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorRepository } from '../repositories/author.repository';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';
import { AuthorFilterQueryDto } from '../dto/filter-query.dto';
import { PaginationDto } from '@/core/types/pagination.dto';
import { AuthorEntity } from '../entities/author.entity';

const mockAuthorRepository = () => ({
  create: jest.fn(),
  search: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

type MockAuthorRepository = ReturnType<typeof mockAuthorRepository>;

describe('AuthorService', () => {
  let service: AuthorService;
  let repository: MockAuthorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        { provide: AuthorRepository, useFactory: mockAuthorRepository },
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
    repository = module.get<AuthorRepository>(
      AuthorRepository,
    ) as unknown as MockAuthorRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create an author', async () => {
      const dto: CreateAuthorDto = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Software engineer',
        birthDate: '1990-01-01',
      };

      const savedEntity = { id: 'uuid', ...dto } as unknown as AuthorEntity;
      repository.create.mockResolvedValue(savedEntity);

      const result = await service.create(dto);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(savedEntity);
    });
  });

  describe('findAll', () => {
    it('should return paginated authors', async () => {
      const filter = {
        search: 'John',
        page: 1,
        limit: 10,
      } as AuthorFilterQueryDto;
      const pagination = { page: 1, limit: 10 } as PaginationDto;

      const entityList: AuthorEntity[] = [
        { id: 'uuid1' } as unknown as AuthorEntity,
        { id: 'uuid2' } as unknown as AuthorEntity,
      ];

      repository.search.mockResolvedValue([entityList, 2]);

      const result = await service.findAll(filter, pagination);
      expect(repository.search).toHaveBeenCalledWith(filter, pagination);
      expect(result.items).toHaveLength(2);
      expect(result.meta.totalItems).toBe(2);
      expect(result.meta.totalPages).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return an author when found', async () => {
      const id = 'uuid';
      const entity = { id } as unknown as AuthorEntity;
      repository.findOne.mockResolvedValue(entity);

      const result = await service.findOne(id);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(entity);
    });

    it('should throw NotFoundException when author not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the author', async () => {
      const id = 'uuid';
      const dto: UpdateAuthorDto = { bio: 'Updated bio' };
      const updatedEntity = {
        id,
        bio: 'Updated bio',
      } as unknown as AuthorEntity;

      repository.update.mockResolvedValue(updatedEntity);

      const result = await service.update(id, dto);
      expect(repository.update).toHaveBeenCalledWith({ id }, dto);
      expect(result).toEqual(updatedEntity);
    });

    it('should throw NotFoundException when update returns null', async () => {
      repository.update.mockResolvedValue(null);
      await expect(
        service.update('missing-id', {} as unknown as UpdateAuthorDto),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete the author successfully', async () => {
      repository.delete.mockResolvedValue({
        id: 'uuid',
      } as unknown as AuthorEntity);
      await expect(service.remove('uuid')).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith({ id: 'uuid' });
    });

    it('should throw NotFoundException when delete returns null', async () => {
      repository.delete.mockResolvedValue(null);
      await expect(service.remove('missing-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
