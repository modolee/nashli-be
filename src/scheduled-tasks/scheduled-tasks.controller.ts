import { AuthGuard } from '@/common/guards/auth.guards';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { BroadcastsTask } from './tasks/broadcasts.task';
import { SimpleTimelinesTask } from './tasks/simple-timelines.task';
import { TimelinesTask } from './tasks/timelines.task';

@UseGuards(AuthGuard)
@Controller('admin/task')
export class ScheduledTasksController {
  constructor(
    private readonly timelinesTask: TimelinesTask,
    private readonly broadcastsTask: BroadcastsTask,
    private readonly simpleTimelinesTask: SimpleTimelinesTask,
  ) {}

  @Post('timelines')
  async runTimelinesTask() {
    const data = await this.timelinesTask.hourlyCron();

    return { data };
  }

  @Post('broadcasts')
  async runBroadcastsTask() {
    const data = await this.broadcastsTask.hourlyCron();

    return { data };
  }

  @Post('simple-timelines')
  async runSimpleTimelinesTask() {
    const data = await this.simpleTimelinesTask.hourlyCron();

    return { data };
  }
}
