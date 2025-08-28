import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PersonsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePersonDto) {
    return this.prisma.person.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        nickname: dto.nickname ?? null,
        birthDate: new Date(dto.birthDate),
        nationality: dto.nationality,
      },
    });
  }

  async findAll() {
    return this.prisma.person.findMany();
  }

  async findOne(id: string) {
    return this.prisma.person.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdatePersonDto) {
    const { firstName, lastName, nickname, birthDate, nationality } = dto;

    return this.prisma.person.update({
      where: { id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(nickname !== undefined && { nickname }),
        ...(birthDate !== undefined && {
          birthDate:
            typeof birthDate === 'string'
              ? new Date(birthDate)
              : (birthDate as Date),
        }),
        ...(nationality !== undefined && { nationality }),
      },
    });
  }

  async remove(id: string) {
    await this.prisma.person.delete({ where: { id } });
    return { id, deleted: true };
  }
}
