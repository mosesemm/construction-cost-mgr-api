import { Module } from '@nestjs/common';
import { CostItemsController } from './cost-items.controller';
import { CostItemsService } from './cost-items.service';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [ProjectsModule],
  controllers: [CostItemsController],
  providers: [CostItemsService],
})
export class CostItemsModule {}
