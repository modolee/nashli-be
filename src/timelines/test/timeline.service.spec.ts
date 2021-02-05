import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '@database/database.service';
import { DatabaseModule } from '@database/database.module';
import { TimelineService } from '@timeline/services/timeline.service';
import { TimelineModule } from '@timeline/timeline.module';
import timelineDummy from '@dummies/timeline.json';
import { TimelineRepository } from '@timeline/repositories/timeline.repository';
import exp from 'constants';

describe('TimelineService', () => {
  let module: TestingModule;
  let service: TimelineService;
  let repository: TimelineRepository;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TimelineModule],
      providers: [],
    }).compile();

    service = module.get<TimelineService>(TimelineService);
    repository = module.get<TimelineRepository>(TimelineRepository);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterAll(async () => {
    await databaseService.connection.close();
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.only('Get timeline data - 성공', async () => {
    // GIVEN

    // WHEN
    const { list, next } = await repository.getTimeline();

    // THEN
    expect(list.length).toBeGreaterThan(0);
  });

  it('Create Timeline - 성공', async () => {
    // GIVEN
    const broadcastDate = new Date(2021, 2, 5);
    // WHEN
    const createdTimeline = await service.create({ broadcastDate, timelineData: timelineDummy });

    // THEN
    expect(createdTimeline).toMatchObject({ broadcastDate, timelineData: timelineDummy });
  });
});
