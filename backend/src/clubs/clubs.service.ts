import { Injectable } from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Prisma } from '../../generated/prisma/client';

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
    return this.prisma.club.findMany();
  }

  async findOne(id: string) {
    return this.prisma.club.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateClubDto) {
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
    await this.prisma.club.delete({ where: { id } });
    return { id, deleted: true };
  }
}
