import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Prisma } from '../../generated/prisma/client';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClubDto) {
    const name = dto.name.trim();

    return this.prisma.club.create({
      data: { name, sportId: dto.sportId },
    });
  }

  async findAll() {
    return this.prisma.club.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        sport: { select: { name: true } },
      },
    });
  }

  async findOne(id: string) {
    const existing = await this.prisma.club.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }
    return this.prisma.club.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateClubDto) {
    const existing = await this.prisma.club.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }
    const data: Prisma.ClubUpdateInput = {};

    if (dto.name !== undefined) {
      const trimmed = dto.name.trim();

      data.name = trimmed;
    }

    if (dto.sportId !== undefined) {
      data.sport = { connect: { id: dto.sportId } };
    }
    return this.prisma.club.update({ where: { id }, data });
  }

  async remove(id: string) {
    const existing = await this.prisma.club.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }
    return this.prisma.club.delete({ where: { id } });
  }
}
