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
        first_name: dto.first_name,
        last_name: dto.last_name,
        nickname: dto.nickname ?? null,
        birth_date: new Date(dto.birth_date),
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
    const { first_name, last_name, nickname, birth_date, nationality } = dto;

    return this.prisma.person.update({
      where: { id },
      data: {
        ...(first_name !== undefined && { first_name }),
        ...(last_name !== undefined && { last_name }),
        ...(nickname !== undefined && { nickname }),
        ...(birth_date !== undefined && {
          // Accepts "YYYY-MM-DD" and converts to Date
          birth_date:
            typeof birth_date === 'string'
              ? new Date(birth_date)
              : (birth_date as Date),
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
