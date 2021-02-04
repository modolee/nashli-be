import { Module } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';

@Module({
  providers: [BroadcastService]
})
export class BroadcastModule {}
