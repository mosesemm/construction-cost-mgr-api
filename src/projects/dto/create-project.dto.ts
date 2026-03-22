import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';
import { ProjectStatus } from '../project.entity';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Office Building Renovation',
    description: 'Name of the project',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({
    example: 'Full renovation of the 5-storey office building on Main St.',
    description: 'Detailed project description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '123 Main Street, New York, NY',
    description: 'Project site location',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 500000, description: 'Total approved budget in USD' })
  @IsNumber()
  @IsPositive()
  budget: number;

  @ApiPropertyOptional({
    enum: ProjectStatus,
    default: ProjectStatus.PLANNING,
    description: 'Current project status',
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
