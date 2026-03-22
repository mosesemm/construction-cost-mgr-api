import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { CostCategory } from '../cost-item.entity';

export class CreateCostItemDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'UUID of the project this cost item belongs to',
  })
  @IsUUID()
  projectId: string;

  @ApiProperty({
    enum: CostCategory,
    example: CostCategory.MATERIALS,
    description: 'Category of the cost item',
  })
  @IsEnum(CostCategory)
  category: CostCategory;

  @ApiProperty({
    example: 'Structural steel beams',
    description: 'Description of the cost item',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 50, description: 'Number of units' })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 1200.5, description: 'Cost per unit in USD' })
  @IsNumber()
  @IsPositive()
  unitCost: number;

  @ApiPropertyOptional({
    example: 60025,
    description:
      'Total cost (quantity × unitCost). Computed automatically if omitted.',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  totalCost?: number;
}
