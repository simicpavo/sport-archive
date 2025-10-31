import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNationalTeamDto } from './dto/create-national-team.dto';
import { UpdateNationalTeamDto } from './dto/update-national-team.dto';

@Injectable()
export class NationalTeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNationalTeamDto) {
    const name = dto.name.trim();

    return this.prisma.nationalTeam.create({
      data: { name, sportId: dto.sportId },
    });
  }

  async findAll() {
    return this.prisma.nationalTeam.findMany({
      select: {
        id: true,
        name: true,
        sportId: true,
        createdAt: true,
        updatedAt: true,
        sport: { select: { name: true } },
      },
    });
  }

  async findOne(id: string) {
    const existing = await this.prisma.nationalTeam.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`NationalTeam with ID ${id} not found`);
    }
    return this.prisma.nationalTeam.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateNationalTeamDto) {
    const existing = await this.prisma.nationalTeam.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`NationalTeam with ID ${id} not found`);
    }
    const data: Prisma.NationalTeamUpdateInput = {};

    if (dto.name !== undefined) {
      const trimmed = dto.name.trim();

      data.name = trimmed;
    }

    if (dto.sportId !== undefined) {
      data.sport = { connect: { id: dto.sportId } };
    }
    return this.prisma.nationalTeam.update({ where: { id }, data });
  }

  async remove(id: string) {
    const existing = await this.prisma.nationalTeam.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`NationalTeam with ID ${id} not found`);
    }

    return this.prisma.nationalTeam.delete({ where: { id } });
  }
}
