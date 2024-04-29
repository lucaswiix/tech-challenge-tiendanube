import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Merchants')
@Controller({
  path: 'merchants',
  version: '1',
})
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Get(':id/payables')
  findAll(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(20)) limit: number,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ) {
    return this.merchantsService.findAll(id, {
      filters: {
        betweenDates:
          startDate && endDate
            ? {
                startDate,
                endDate,
              }
            : undefined,
      },
      pagination: {
        page,
        limit: limit > 20 ? 20 : limit,
      },
    });
  }
}
