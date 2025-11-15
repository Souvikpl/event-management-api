import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

  async create(createDto: CreateEventDto, userId: string, banner?: string) {
    const eventDate = new Date(createDto.date);
    if (eventDate <= new Date()) throw new BadRequestException('Event date must be in the future');
    const created = new this.eventModel({
      ...createDto,
      date: eventDate,
      createdBy: userId,
      banner,
    });
    return created.save();
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, query.limit || 10);
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }
    if (query.dateFrom || query.dateTo) {
      filter.date = {};
      if (query.dateFrom) filter.date.$gte = new Date(query.dateFrom);
      if (query.dateTo) filter.date.$lte = new Date(query.dateTo);
    }

    const [items, total] = await Promise.all([
      this.eventModel
        .find(filter)
        .populate('createdBy', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ date: 1 })
        .exec(),
      this.eventModel.countDocuments(filter).exec(),
    ]);

    return {
      items,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const event = await this.eventModel.findById(id).populate('createdBy', 'name email').exec();
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: string, updateDto: Partial<CreateEventDto>, banner?: string) {
    if (updateDto.date) {
      const d = new Date(updateDto.date);
      if (d <= new Date()) throw new BadRequestException('Event date must be in the future');
      updateDto.date = d.toISOString();
    }
    const updated = await this.eventModel.findByIdAndUpdate(id, { ...updateDto, ...(banner ? { banner } : {}) }, { new: true }).exec();
    if (!updated) throw new NotFoundException('Event not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.eventModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Event not found');
    return { success: true };
  }

  async registerAttendee(eventId: string, userId: string) {
    const event = await this.eventModel.findById(eventId);
    if (!event) throw new NotFoundException('Event not found');
    if (event.attendees.some((a) => (a as any).equals(userId))) {
      throw new BadRequestException('Already registered');
    }
    event.attendees.push(new Types.ObjectId(userId));
    await event.save();
    return event;
  }
}
