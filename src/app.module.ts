import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TimelinesModule } from '@timelines/timelines.module';
import { BroadcastsModule } from '@broadcasts/broadcasts.module';
import { SimpleTimelinesModule } from '@simple-timelines/simple-timelines.module';
import { ScheduledTasksModule } from '@scheduled-tasks/scheduled-tasks.module';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { HttpResponseInterceptor } from '@common/interceptors/http-response.interceptor';

@Module({
  imports: [TimelinesModule, BroadcastsModule, SimpleTimelinesModule, ScheduledTasksModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpResponseInterceptor,
    },
  ],
})
export class AppModule {}
