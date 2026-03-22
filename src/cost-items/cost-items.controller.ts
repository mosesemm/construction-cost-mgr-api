import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CostItemsService } from './cost-items.service';
import { CreateCostItemDto } from './dto/create-cost-item.dto';
import { UpdateCostItemDto } from './dto/update-cost-item.dto';

@ApiTags('cost-items')
@Controller('cost-items')
export class CostItemsController {
  constructor(private readonly costItemsService: CostItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cost item for a project' })
  @ApiBody({ type: CreateCostItemDto })
  @ApiResponse({ status: 201, description: 'Cost item successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  create(@Body() createCostItemDto: CreateCostItemDto) {
    return this.costItemsService.create(createCostItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all cost items' })
  @ApiResponse({ status: 200, description: 'List of all cost items.' })
  findAll() {
    return this.costItemsService.findAll();
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Retrieve all cost items for a specific project' })
  @ApiParam({ name: 'projectId', description: 'UUID of the project' })
  @ApiResponse({
    status: 200,
    description: 'List of cost items for the project.',
  })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  findByProject(@Param('projectId') projectId: string) {
    return this.costItemsService.findByProject(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single cost item by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the cost item' })
  @ApiResponse({ status: 200, description: 'The cost item record.' })
  @ApiResponse({ status: 404, description: 'Cost item not found.' })
  findOne(@Param('id') id: string) {
    return this.costItemsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing cost item' })
  @ApiParam({ name: 'id', description: 'UUID of the cost item' })
  @ApiBody({ type: UpdateCostItemDto })
  @ApiResponse({ status: 200, description: 'Cost item successfully updated.' })
  @ApiResponse({ status: 404, description: 'Cost item not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  update(
    @Param('id') id: string,
    @Body() updateCostItemDto: UpdateCostItemDto,
  ) {
    return this.costItemsService.update(id, updateCostItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a cost item by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the cost item' })
  @ApiResponse({ status: 204, description: 'Cost item successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Cost item not found.' })
  remove(@Param('id') id: string) {
    this.costItemsService.remove(id);
  }
}
