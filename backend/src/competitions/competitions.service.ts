import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';

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

    const data: Prisma.CompetitionCreateInput = {
      name: dto.name,
      season: dto.season,
      startDate: dto.startDate,
      endDate: dto.endDate,
      sport: { connect: { id: dto.sportId } },
    };

    return this.prisma.competition.create({ data });
  }

  async findAll() {
    return this.prisma.competition.findMany({
      select: {
        id: true,
        name: true,
        season: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
        sport: { select: { name: true } },
      },
    });
  }

  async findOne(id: string) {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }

    return competition;
  }

  async update(id: string, dto: UpdateCompetitionDto) {
    const existing = await this.prisma.competition.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }

    const data: Prisma.CompetitionUpdateInput = {
      ...(dto.name !== undefined && { name: dto.name.trim() }),
      ...(dto.season !== undefined && { season: dto.season }),
      ...(dto.sportId !== undefined && {
        sport: { connect: { id: dto.sportId } },
      }),
      ...(dto.startDate !== undefined && {
        startDate: dto.startDate,
      }),
      ...(dto.endDate !== undefined && {
        endDate: dto.endDate,
      }),
    };

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

    if (dto.sportId !== undefined) {
      const sport = await this.prisma.sport.findUnique({
        where: { id: dto.sportId },
        select: { id: true },
      });

      if (!sport) {
        throw new NotFoundException(`Sport with ID ${dto.sportId} not found`);
      }

      data.sport = { connect: { id: dto.sportId } };
    }

    return this.prisma.competition.update({ where: { id }, data });
  }

  async remove(id: string) {
    const existing = await this.prisma.competition.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }

    return this.prisma.competition.delete({ where: { id } });
  }
}
