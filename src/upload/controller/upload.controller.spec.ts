import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from '../service/upload.service';
import { ModuleMocker } from 'jest-mock';

const moduleMoker = new ModuleMocker(global);

describe('UploadController', () => {
  let controller: UploadController;
  let mockedUploadService: jest.Mocked<UploadService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [UploadService],
    }).compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = ['test'];
      jest.spyOn(service, 'findAll').mockImplementation(() => result);

      expect(await controller.fetchAiData()).toBe(result);
    });
  });
});
