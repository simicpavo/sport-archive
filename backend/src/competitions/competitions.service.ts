import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class CompetitionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCompetitionDto) {
    const name = dto.name.trim();

    const existing = await this.prisma.competition.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException('Competition already exists');
    }
    return this.prisma.competition.create({
      data: { name, sportId: dto.sportId },
    });
  }

  async findAll() {
    return this.prisma.competition.findMany();
  }

  async findOne(id: string) {
    return this.prisma.competition.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateCompetitionDto) {
    const data: Prisma.CompetitionUpdateInput = {};

    if (dto.name !== undefined) {
      const trimmed = dto.name.trim();

      const dup = await this.prisma.competition.findFirst({
        where: { name: { equals: trimmed, mode: 'insensitive' }, NOT: { id } },
        select: { id: true },
      });

      if (dup) {
        throw new ConflictException('Competition already exists');
      }
      data.name = trimmed;
    }
    return this.prisma.competition.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.competition.delete({
      where: { id },
    });
  }
}
