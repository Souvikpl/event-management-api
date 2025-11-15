import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Get,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateEventDto } from './dto/create-event.dto';
import * as path from 'path';
import * as fs from 'fs';

const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  async list(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
  ) {
    return this.eventsService.findAll({ page, limit, search, dateFrom, dateTo });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @UseInterceptors(FileInterceptor('banner', { storage, limits: { fileSize: 5 * 1024 * 1024 } }))
  async create(@UploadedFile() file: Express.Multer.File, @Body() body: CreateEventDto, @Req() req) {
    const banner = file ? file.filename : undefined;
    return this.eventsService.create(body, req.user._id, banner);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @UseInterceptors(FileInterceptor('banner', { storage, limits: { fileSize: 5 * 1024 * 1024 } }))
  async update(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body() body: Partial<CreateEventDto>) {
    const banner = file ? file.filename : undefined;
    return this.eventsService.update(id, body, banner);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/register')
  async register(@Param('id') id: string, @Req() req) {
    return this.eventsService.registerAttendee(id, req.user._id);
  }
}
