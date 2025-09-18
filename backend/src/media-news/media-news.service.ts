import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class MediaNewsService {
  constructor(private prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto) {
    const { page, take, sortBy, sortOrder, startDate, endDate } = paginationDto;
    const skip = (page - 1) * take;

    // Build date filters only if dates are provided
    const dateFilters: { gte?: Date; lte?: Date } = {};
    if (startDate) {
      dateFilters.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilters.lte = new Date(endDate);
    }

    // Only include createdAt in where clause if we have date filters
    const where =
      Object.keys(dateFilters).length > 0 ? { createdAt: dateFilters } : {};

    const [news, total] = await this.prisma.$transaction([
      this.prisma.mediaNews.findMany({
        skip,
        take,
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          MediaSource: true,
        },
      }),
      this.prisma.mediaNews.count({ where }),
    ]);

    // Map the MediaSource to mediaSource for frontend compatibility
    const mappedNews = news.map((item) => ({
      ...item,
      mediaSource: item.MediaSource
        ? {
            id: item.MediaSource.id,
            name: item.MediaSource.name,
            url: item.MediaSource.baseUrl,
            logoUrl: null,
            createdAt: item.MediaSource.createdAt,
            updatedAt: item.MediaSource.updatedAt,
          }
        : null,
      MediaSource: undefined, // Remove the original field
    }));

    return {
      data: mappedNews,
      total,
      page,
      take,
    };
  }

  async findOne(id: string) {
    const mediaNews = await this.prisma.mediaNews.findUnique({
      where: { id },
      include: {
        MediaSource: true,
      },
    });

    if (!mediaNews) {
      throw new NotFoundException(`Media news with ID ${id} not found`);
    }

    // Map the MediaSource to mediaSource for frontend compatibility
    return {
      ...mediaNews,
      mediaSource: mediaNews.MediaSource
        ? {
            id: mediaNews.MediaSource.id,
            name: mediaNews.MediaSource.name,
            url: mediaNews.MediaSource.baseUrl,
            logoUrl: null,
            createdAt: mediaNews.MediaSource.createdAt,
            updatedAt: mediaNews.MediaSource.updatedAt,
          }
        : null,
      MediaSource: undefined, // Remove the original field
    };
  }

  async remove(id: string) {
    try {
      await this.prisma.mediaNews.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Media news with ID ${id} not found`);
        }
      }
      throw error;
    }
  }
}
