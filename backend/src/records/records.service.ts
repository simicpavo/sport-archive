import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Prisma } from '../../generated/prisma/client';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

@Injectable()
export class RecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRecordDto) {
    const sport = await this.prisma.sport.findUnique({
      where: { id: dto.sportId },
      select: { id: true },
    });

    if (!sport) {
      throw new NotFoundException(`Sport with ID ${dto.sportId} not found`);
    }

    const contentType = await this.prisma.contentType.findUnique({
      where: { id: dto.contentTypeId },
      select: { id: true },
    });

    if (!contentType) {
      throw new NotFoundException(
        `ContentType with ID ${dto.contentTypeId} not found`,
      );
    }

    if (dto.competitionId) {
      const competition = await this.prisma.competition.findUnique({
        where: { id: dto.competitionId },
        select: { id: true },
      });

      if (!competition) {
        throw new NotFoundException(
          `Competition with ID ${dto.competitionId} not found`,
        );
      }
    }

    if (dto.nationalTeamId) {
      const nationalTeam = await this.prisma.nationalTeam.findUnique({
        where: { id: dto.nationalTeamId },
        select: { id: true },
      });

      if (!nationalTeam) {
        throw new NotFoundException(
          `NationalTeam with ID ${dto.nationalTeamId} not found`,
        );
      }
    }

    if (dto.personIds && dto.personIds.length > 0) {
      const persons = await this.prisma.person.findMany({
        where: { id: { in: dto.personIds } },
        select: { id: true },
      });

      if (persons.length !== dto.personIds.length) {
        const foundIds = persons.map((p) => p.id);

        const missingIds = dto.personIds.filter((id) => !foundIds.includes(id));

        throw new NotFoundException(
          `Persons with IDs ${missingIds.join(', ')} not found`,
        );
      }
    }

    if (dto.clubIds && dto.clubIds.length > 0) {
      const clubs = await this.prisma.club.findMany({
        where: { id: { in: dto.clubIds } },
        select: { id: true },
      });

      if (clubs.length !== dto.clubIds.length) {
        const foundIds = clubs.map((c) => c.id);

        const missingIds = dto.clubIds.filter((id) => !foundIds.includes(id));

        throw new NotFoundException(
          `Clubs with IDs ${missingIds.join(', ')} not found`,
        );
      }
    }

    const data: Prisma.RecordCreateInput = {
      title: dto.title,
      description: dto.description,
      ...(dto.date && { date: new Date(dto.date) }),
      ...(dto.popularityScore !== undefined && {
        popularityScore: dto.popularityScore,
      }),

      sport: { connect: { id: dto.sportId } },
      contentType: { connect: { id: dto.contentTypeId } },
      ...(dto.competitionId && {
        competition: { connect: { id: dto.competitionId } },
      }),

      ...(dto.nationalTeamId && {
        nationalTeam: { connect: { id: dto.nationalTeamId } },
      }),

      ...(dto.personIds &&
        dto.personIds.length > 0 && {
          persons: { connect: dto.personIds.map((id) => ({ id })) },
        }),

      ...(dto.clubIds &&
        dto.clubIds.length > 0 && {
          clubs: { connect: dto.clubIds.map((id) => ({ id })) },
        }),
    };

    return this.prisma.record.create({ data });
  }

  async findAll() {
    return this.prisma.record.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        updatedAt: true,
        contentType: { select: { name: true } },
      },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.record.findUnique({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }

    return record;
  }

  async update(id: string, dto: UpdateRecordDto) {
    const existing = await this.prisma.record.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }

    if (dto.sportId) {
      const sport = await this.prisma.sport.findUnique({
        where: { id: dto.sportId },
      });

      if (!sport) {
        throw new NotFoundException(`Sport with ID ${dto.sportId} not found`);
      }
    }

    if (dto.contentTypeId) {
      const contentType = await this.prisma.contentType.findUnique({
        where: { id: dto.contentTypeId },
      });

      if (!contentType) {
        throw new NotFoundException(
          `ContentType with ID ${dto.contentTypeId} not found`,
        );
      }
    }

    if (dto.competitionId) {
      const competition = await this.prisma.competition.findUnique({
        where: { id: dto.competitionId },
      });

      if (!competition) {
        throw new NotFoundException(
          `Competition with ID ${dto.competitionId} not found`,
        );
      }
    }

    if (dto.nationalTeamId) {
      const nationalTeam = await this.prisma.nationalTeam.findUnique({
        where: { id: dto.nationalTeamId },
      });

      if (!nationalTeam) {
        throw new NotFoundException(
          `NationalTeam with ID ${dto.nationalTeamId} not found`,
        );
      }
    }

    if (dto.personIds) {
      const persons = await this.prisma.person.findMany({
        where: { id: { in: dto.personIds } },
      });

      if (persons.length !== dto.personIds.length) {
        const foundIds = persons.map((p) => p.id);

        const missingIds = dto.personIds.filter((id) => !foundIds.includes(id));

        throw new NotFoundException(
          `Persons with IDs ${missingIds.join(', ')} not found`,
        );
      }
    }

    if (dto.clubIds) {
      const clubs = await this.prisma.club.findMany({
        where: { id: { in: dto.clubIds } },
      });

      if (clubs.length !== dto.clubIds.length) {
        const foundIds = clubs.map((c) => c.id);

        const missingIds = dto.clubIds.filter((id) => !foundIds.includes(id));

        throw new NotFoundException(
          `Clubs with IDs ${missingIds.join(', ')} not found`,
        );
      }
    }

    const data: Prisma.RecordUpdateInput = {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.date !== undefined && {
        date: dto.date ? new Date(dto.date) : null,
      }),

      ...(dto.popularityScore !== undefined && {
        popularityScore: dto.popularityScore,
      }),

      ...(dto.sportId && { sport: { connect: { id: dto.sportId } } }),
      ...(dto.contentTypeId && {
        contentType: { connect: { id: dto.contentTypeId } },
      }),

      ...(dto.competitionId && {
        competition: { connect: { id: dto.competitionId } },
      }),

      ...(dto.nationalTeamId && {
        nationalTeam: { connect: { id: dto.nationalTeamId } },
      }),

      ...(dto.personIds && {
        persons: { set: dto.personIds.map((id) => ({ id })) },
      }),

      ...(dto.clubIds && { clubs: { set: dto.clubIds.map((id) => ({ id })) } }),
    };

    return this.prisma.record.update({ where: { id }, data });
  }

  async remove(id: string) {
    const existing = await this.prisma.record.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }

    return this.prisma.record.delete({ where: { id } });
  }
}
