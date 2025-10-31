import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, MediaSource as PrismaMediaSource } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMediaSourceDto } from './dto/create-media-source.dto';
import { UpdateMediaSourceDto } from './dto/update-media-source.dto';

@Injectable()
export class MediaSourceService {
  constructor(private prisma: PrismaService) {}

  async create(createMediaSourceDto: CreateMediaSourceDto) {
    try {
      return await this.prisma.mediaSource.create({
        data: createMediaSourceDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Media source with this name already exists',
          );
        }
      }
      throw error;
    }
  }

  async findAll(): Promise<PrismaMediaSource[]> {
    return this.prisma.mediaSource.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<PrismaMediaSource> {
    const mediaSource = await this.prisma.mediaSource.findUnique({
      where: { id },
    });

    if (!mediaSource) {
      throw new NotFoundException(`Media source with ID ${id} not found`);
    }

    return mediaSource;
  }

  async update(
    id: string,
    updateMediaSourceDto: UpdateMediaSourceDto,
  ): Promise<PrismaMediaSource> {
    try {
      return await this.prisma.mediaSource.update({
        where: { id },
        data: updateMediaSourceDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Media source with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException(
            'Media source with this name already exists',
          );
        }
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.mediaSource.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Media source with ID ${id} not found`);
        }
      }
      throw error;
    }
  }
}
