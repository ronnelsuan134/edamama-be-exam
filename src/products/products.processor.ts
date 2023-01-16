import { Process, Processor } from "@nestjs/bull";
import { Job } from 'bull';

@Processor('ProductFile')
export class ProductConsumer {
  @Process('product-file')
  async queueProductFile(job: Job<unknown>) {

  }
}