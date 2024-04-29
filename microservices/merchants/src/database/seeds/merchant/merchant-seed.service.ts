import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Merchant } from 'src/merchants/entities/merchant.entity';
import { Repository } from 'typeorm';
@Injectable()
export class MerchantSeedService {
  constructor(
    @InjectRepository(Merchant)
    private repository: Repository<Merchant>,
  ) {}

  async run() {
    const isExist = await this.repository.count();

    if (isExist) {
      return;
    }

    await this.repository.save(
      this.repository.create({
        name: 'John Smith',
        documentId: '11122233344',
      }),
    );
  }
}
