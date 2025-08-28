import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContentTypeDto } from './dto/create-content-type.dto';
import { UpdateContentTypeDto } from './dto/update-content-type.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ContentTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContentTypeDto) {
    const name = dto.name.trim();

    return this.prisma.contentType.create({
      data: { name },
    });
  }

  async findAll() {
    return this.prisma.contentType.findMany();
  }

  async findOne(id: string) {
    const existing = await this.prisma.contentType.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`ContentType with ID ${id} not found`);
    }
    return this.prisma.contentType.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateContentTypeDto) {
    const existing = await this.prisma.contentType.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`ContentType with ID ${id} not found`);
    }
    const data: Prisma.ContentTypeUpdateInput = {};

    if (dto.name !== undefined) {
      const trimmed = dto.name.trim();

      data.name = trimmed;
    }

    return this.prisma.contentType.update({ where: { id }, data });
  }

  async remove(id: string) {
    const existing = await this.prisma.contentType.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`ContentType with ID ${id} not found`);
    }

    return this.prisma.contentType.delete({ where: { id } });
  }
}
