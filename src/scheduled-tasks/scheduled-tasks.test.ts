import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastsTask } from '@scheduled-tasks/tasks/broadcasts.task';
import { ScheduledTasksModule } from '@scheduled-tasks/scheduled-tasks.module';
import { TimelinesTask } from '@scheduled-tasks/tasks/timelines.task';
import { SimpleTimelinesTask } from '@scheduled-tasks/tasks/simple-timelines.task';

describe('Cron Job 테스트', () => {
  let module: TestingModule;
  let timelinesTask: TimelinesTask;
  let broadcastTask: BroadcastsTask;
  let simpleTimelinesTask: SimpleTimelinesTask;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ScheduledTasksModule],
    }).compile();

    timelinesTask = module.get<TimelinesTask>(TimelinesTask);
    broadcastTask = module.get<BroadcastsTask>(BroadcastsTask);
    simpleTimelinesTask = module.get<SimpleTimelinesTask>(SimpleTimelinesTask);
  });

  afterAll(async () => {
    await module.close();
  });

  test('방송 타임라인 정보 Cron', async () => {
    // GIVEN

    // WHEN
    const result = await timelinesTask.hourlyCron();

    // THEN
  });

  test('상세 방송 정보 Cron', async () => {
    // GIVEN

    // WHEN
    const result = await broadcastTask.hourlyCron();

    // THEN
  });

  test('단순화 시킨 타임라인 정보 Cron', async () => {
    // GIVEN

    // WHEN
    const result = await simpleTimelinesTask.hourlyCron();

    // THEN
  });
});
