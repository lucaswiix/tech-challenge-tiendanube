export class FindAllByMerchantId {
  merchantId: string;
  filters: {
    betweenDates?: {
      startDate: string;
      endDate: string;
    };
  };
  pagination: {
    limit: number;
    page: number;
  };
}
