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
    try {
      return await this.prisma.sport.create({ data: { name } });
    } catch (e) {
      if (this.isUnique(e))
        throw new ConflictException('Sport name already exists');
      throw e;
    }
  }

  findAll() {
    return this.prisma.sport.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const sport = await this.prisma.sport.findUnique({
      where: { id },
    });
    if (!sport) {
      throw new NotFoundException('Sport not found');
    }
    return sport;
  }

  async update(id: string, dto: UpdateSportDto) {
    await this.ensureExists(id);
    const data: Prisma.SportUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name.trim();
    try {
      return await this.prisma.sport.update({ where: { id }, data });
    } catch (e) {
      if (this.isUnique(e))
        throw new ConflictException('Sport name already exists');
      throw e;
    }
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.sport.delete({ where: { id } });
    return { id, deleted: true };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.sport.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Sport not found');
  }

  private isUnique(e: unknown): boolean {
    return (
      typeof e === 'object' &&
      e !== null &&
      'code' in e &&
      (e as { code?: unknown }).code === 'P2002'
    );
  }
}
