import { Module } from '@nestjs/common';
import { BroadcastsService } from './services/broadcasts.service';
import { DatabaseModule } from '@database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Broadcast, BroadcastSchema } from '@broadcasts/schemas/broadcast.schema';
import { BroadcastRepository } from '@broadcasts/repositories/broadcast.repository';

@Module({
  imports: [DatabaseModule, MongooseModule.forFeature([{ name: Broadcast.name, schema: BroadcastSchema }])],
  providers: [BroadcastsService, BroadcastRepository],
  exports: [BroadcastsService, BroadcastRepository],
})
export class BroadcastsModule {}
