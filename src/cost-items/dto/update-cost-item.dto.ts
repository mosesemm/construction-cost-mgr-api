import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCostItemDto } from './create-cost-item.dto';

export class UpdateCostItemDto extends PartialType(
  OmitType(CreateCostItemDto, ['projectId'] as const),
) {}
