import { Test, TestingModule } from '@nestjs/testing';
import { SimpleTimelineService } from './simple-timeline.service';

describe('SimpleTimelineService', () => {
  let service: SimpleTimelineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimpleTimelineService],
    }).compile();

    service = module.get<SimpleTimelineService>(SimpleTimelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
