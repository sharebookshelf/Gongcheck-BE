import { Test, TestingModule } from '@nestjs/testing';
import { UploadRepository } from './upload.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bookshelf } from 'src/entities/bookshelf.entity';
import { UserBook } from 'src/entities/userBook.entity';
import { Book } from 'src/entities/book.entity';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateBook, UserInfo } from '../interface/createBook';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

const mockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  insert: jest.fn(),
});

describe('UploadRepository', () => {
  let uploadRepository: UploadRepository;
  let dataSourceMock: Partial<DataSource>;
  // let requestMock: Partial<Request>;

  beforeEach(async () => {
    // DataSource와 Request의 모킹(mocking)
    dataSourceMock = {
      getRepository: jest.fn().mockReturnValue({
        create: jest.fn(),
        insert: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadRepository,
        {
          provide: DataSource,
          useValue: dataSourceMock,
        },
      ],
    }).compile();

    uploadRepository = module.get<UploadRepository>(UploadRepository);
  });

  it('should be defined', () => {
    expect(uploadRepository).toBeDefined();
  });

  describe('createBookshelf', () => {
    it('should create a new bookshelf', async () => {
      const url = 'http://testUrl.jpg';
      const userId = 1;
      const bookshelf = {
        bookShelfImage: url,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 레포지토리 메서드의 반환값 설정
      dataSourceMock.getRepository().create.mockReturnValue(bookshelf);
      dataSourceMock.getRepository().insert.mockResolvedValue(undefined); // insert는 반환값이 없거나, 삽입된 엔티티의 정보를 반환할 수 있음

      // repository.create.mockReturnValue(bookshelf);
      // repository.save.mockResolvedValue(bookshelf);

      const result = await uploadRepository.createBookshelf(url, userId);

      expect(result).toEqual(bookshelf);
      expect(repository.create).toBeCalledWith(bookshelf);
      expect(repository.save).toBeCalledWith(bookshelf);
    });
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      const books = [
        {
          title: 'testTitle',
          author: 'testAuthor',
          publisher: 'testPublisher',
          titleUrl: 'testTitleUrl',
          eaAddCode: 'testEaAddCode',
          eaIsbn: 'testEaIsbn',
          setIsbn: 'testSetIsbn',
          setAddCode: 'testSetAddCode',
          prePrice: 'testPrePrice',
          inputDate: 'testInputDate',
        },
      ];
      const uploadRepository = module.get(getRepositoryToken(Book));
      const newBook = {
        title: 'testTitle',
        author: 'testAuthor',
        publisher: 'testPublisher',
        titleUrl: 'testTitleUrl',
        eaAddCode: 'testEaAddCode',
        eaIsbn: 'testEaIsbn',
        setIsbn: 'testSetIsbn',
        setAddCode: 'testSetAddCode',
        prePrice: 'testPrePrice',
        inputDate: 'testInputDate',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const existingBook = {
        bookId: 1,
      };
      uploadRepository.findOne.mockReturnValue(existingBook);
      uploadRepository.create.mockReturnValue(newBook);
      uploadRepository.save.mockResolvedValue(newBook);

      const result = await uploadRepository.createBook(books);

      expect(result).toEqual({
        createdBook: [newBook],
        existingBookIds: [1],
      });
      expect(uploadRepository.findOne).toBeCalledWith({
        where: {
          title: 'testTitle',
          author: 'testAuthor',
          publisher: 'testPublisher',
        },
      });
      expect(uploadRepository.create).toBeCalledWith(newBook);
      expect(uploadRepository.save).toBeCalledWith(newBook);
    });
  });

  describe('createUserBook', () => {
    it('should create a new user book', async () => {
      const userId = 1;
      const bookIds = [1, 2, 3];
      const userBook = [
        {
          userId,
          bookId: 1,
        },
        {
          userId,
          bookId: 2,
        },
        {
          userId,
          bookId: 3,
        },
      ];
      repository.create.mockReturnValue(userBook);
      repository.save.mockResolvedValue(userBook);

      const result = await uploadRepository.createUserBook(userId, bookIds);

      expect(result).toEqual(userBook);
      expect(repository.create).toBeCalledWith(userBook);
      expect(repository.save).toBeCalledWith(userBook);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userInfo: UserInfo = {
        nickname: 'testNickname',
        gender: 'testGender',
        birth: 'testBirth',
      };
      const user = {
        nickname: 'testNickname',
        gender: 'testGender',
        birth: 'testBirth',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const uploadRepository = module.get(getRepositoryToken(User));
      uploadRepository.create.mockReturnValue(user);
      uploadRepository.save.mockResolvedValue(user);

      const result = await uploadRepository.createUser(userInfo);

      expect(result).toEqual(user);
      expect(uploadRepository.create).toBeCalledWith(user);
      expect(uploadRepository.save).toBeCalledWith(user);
    });
  });
});
