import { Test, TestingModule } from '@nestjs/testing';
import { MypagesController } from './mypages.controller';

describe('MypagesController', () => {
  let controller: MypagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MypagesController],
    }).compile();

    controller = module.get<MypagesController>(MypagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
