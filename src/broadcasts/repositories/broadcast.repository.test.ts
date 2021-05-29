import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastRepository } from '@broadcasts/repositories/broadcast.repository';

describe('상세 방송 정보 조회 테스트', () => {
  let module: TestingModule;
  let broadcastRepository: BroadcastRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [BroadcastRepository],
    }).compile();

    broadcastRepository = module.get<BroadcastRepository>(BroadcastRepository);
  });

  afterAll(async () => {
    await module.close();
  });

  test('상세 방송 정보 조회 방송 (정보가 없는 경우)', async () => {
    // GIVEN
    const broadcastId = '139710';

    // WHEN
    const result = await broadcastRepository.getBroadcast(broadcastId);

    // THEN
    expect(result).toBeNull();
  });
});
