import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMediaNewsDto } from './dto/create-media-new.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateMediaNewsDto } from './dto/update-media-new.dto';

@Injectable()
export class MediaNewsService {
  constructor(private prisma: PrismaService) {}

  async create(createMediaNewsDto: CreateMediaNewsDto) {
    const totalEngagements =
      (createMediaNewsDto.likeCount || 0) +
      (createMediaNewsDto.shareCount || 0) +
      (createMediaNewsDto.commentCount || 0);

    try {
      return await this.prisma.mediaNews.create({
        data: {
          ...createMediaNewsDto,
          totalEngagements:
            createMediaNewsDto.totalEngagements || totalEngagements,
        },
        include: {
          MediaSource: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException(
            `Media source with ID ${createMediaNewsDto.mediaSourceId} not found`,
          );
        }
        if (error.code === 'P2002') {
          throw new BadRequestException(
            'Article with this external ID already exists for this media source',
          );
        }
      }
      throw error;
    }
  }

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
          MediaSource: {
            select: {
              name: true,
            },
          },
        },
      }),
      this.prisma.mediaNews.count({ where }),
    ]);

    return {
      data: news,
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

    return mediaNews;
  }

  async update(id: string, updateMediaNewsDto: UpdateMediaNewsDto) {
    // Recalculate total engagements if any engagement metrics are updated
    const updateData = { ...updateMediaNewsDto };

    if (
      updateMediaNewsDto.likeCount !== undefined ||
      updateMediaNewsDto.shareCount !== undefined ||
      updateMediaNewsDto.commentCount !== undefined
    ) {
      const current = await this.findOne(id);

      const likeCount = updateMediaNewsDto.likeCount ?? current.likeCount;
      const shareCount = updateMediaNewsDto.shareCount ?? current.shareCount;
      const commentCount =
        updateMediaNewsDto.commentCount ?? current.commentCount;

      updateData.totalEngagements = likeCount + shareCount + commentCount;
    }

    try {
      return await this.prisma.mediaNews.update({
        where: { id },
        data: updateData,
        include: {
          MediaSource: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Media news with ID ${id} not found`);
        }
        if (error.code === 'P2003') {
          throw new BadRequestException(
            `Media source with ID ${updateMediaNewsDto.mediaSourceId} not found`,
          );
        }
      }
      throw error;
    }
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
