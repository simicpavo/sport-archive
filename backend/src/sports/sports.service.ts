import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class SportsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSportDto) {
    const name = dto.name.trim();

    const existing = await this.prisma.sport.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException('Sport name already exists');
    }
    return this.prisma.sport.create({ data: { name } });
  }

  findAll() {
    return this.prisma.sport.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const sport = await this.prisma.sport.findUnique({
      where: { id },
    });

    if (!sport) {
      throw new NotFoundException(`Sport with ID ${id} not found`);
    }
    return sport;
  }

  async update(id: string, dto: UpdateSportDto) {
    const existing = await this.prisma.sport.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Sport with ID ${id} not found`);
    }
    const data: Prisma.SportUpdateInput = {};

    if (dto.name !== undefined) {
      const trimmed = dto.name.trim();

      const dup = await this.prisma.sport.findFirst({
        where: { name: { equals: trimmed, mode: 'insensitive' }, NOT: { id } },
        select: { id: true },
      });

      if (dup) {
        throw new ConflictException('Sport name already exists');
      }
      data.name = trimmed;
    }
    return this.prisma.sport.update({ where: { id }, data });
  }

  async remove(id: string) {
    const existing = await this.prisma.sport.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Sport with ID ${id} not found`);
    }

    return this.prisma.sport.delete({ where: { id } });
  }
}
