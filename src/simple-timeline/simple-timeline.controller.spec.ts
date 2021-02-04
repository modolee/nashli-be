import { Test, TestingModule } from '@nestjs/testing';
import { SimpleTimelineController } from './simple-timeline.controller';

describe('SimpleTimelineController', () => {
  let controller: SimpleTimelineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimpleTimelineController],
    }).compile();

    controller = module.get<SimpleTimelineController>(SimpleTimelineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
