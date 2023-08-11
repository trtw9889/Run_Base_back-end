import { Test, TestingModule } from '@nestjs/testing';
import { MypagesService } from './mypages.service';

describe('MypagesService', () => {
  let service: MypagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MypagesService],
    }).compile();

    service = module.get<MypagesService>(MypagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
