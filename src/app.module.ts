import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { CostItemsModule } from './cost-items/cost-items.module';

@Module({
  imports: [ProjectsModule, CostItemsModule],
})
export class AppModule {}
