import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '@database/database.service';
import { DatabaseModule } from '@database/database.module';
import { TimelinesService } from '@timelines/services/timelines.service';
import { TimelinesModule } from '@timelines/timelines.module';
import timelineDummy from '@dummies/timeline.json';
import { TimelineRepository } from '@timelines/repositories/timeline.repository';
import { getStartOfDayTimestamp, getTodayString } from '@common/helpers/time.helper';

describe('TimelineService', () => {
  let module: TestingModule;
  let service: TimelinesService;
  let repository: TimelineRepository;
  let databaseService: DatabaseService;

  // GIVEN
  const today = getTodayString();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, TimelinesModule],
      providers: [],
    }).compile();

    service = module.get<TimelinesService>(TimelinesService);
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

  it('Get timeline data - 성공', async () => {
    // GIVEN
    const startOfTodayTimestamp = getStartOfDayTimestamp(today);

    // WHEN
    const { list, next } = await repository.getTimeline(startOfTodayTimestamp);

    // THEN
    expect(list.length).toBeGreaterThan(0);
  });

  it('Create Timeline - 성공', async () => {
    // GIVEN
    const timeline = { date: today, broadcasts: timelineDummy.list };

    // WHEN
    const createdTimeline = await service.create(timeline);

    // THEN
    expect(createdTimeline).toMatchObject(timeline);
  });

  it.only('Find Timeline - 성공', async () => {
    // GIVEN

    // WHEN
    const savedTimeline = await service.findLatest(today);

    // THEN
    console.log(savedTimeline);
  });
});
