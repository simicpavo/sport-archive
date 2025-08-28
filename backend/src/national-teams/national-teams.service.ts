import { ConflictException, Injectable } from '@nestjs/common';
import { CreateNationalTeamDto } from './dto/create-national-team.dto';
import { UpdateNationalTeamDto } from './dto/update-national-team.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class NationalTeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNationalTeamDto) {
    const name = dto.name.trim();

    const existing = await this.prisma.nationalTeam.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException('National team already exists');
    }
    return this.prisma.nationalTeam.create({
      data: { name, sportId: dto.sportId },
    });
  }

  async findAll() {
    return this.prisma.nationalTeam.findMany();
  }

  async findOne(id: string) {
    return this.prisma.nationalTeam.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateNationalTeamDto) {
    const data: Prisma.NationalTeamUpdateInput = {};

    if (dto.name !== undefined) {
      const trimmed = dto.name.trim();

      const dup = await this.prisma.nationalTeam.findFirst({
        where: { name: { equals: trimmed, mode: 'insensitive' }, NOT: { id } },
        select: { id: true },
      });

      if (dup) {
        throw new ConflictException('National team already exists');
      }
      data.name = trimmed;
    }

    if (dto.sportId !== undefined) {
      data.sport = { connect: { id: dto.sportId } };
    }
    return this.prisma.nationalTeam.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.nationalTeam.delete({ where: { id } });
    return { id, deleted: true };
  }
}
