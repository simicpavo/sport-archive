import { PrismaClient } from '../../generated/prisma';
import { _24SATA, GERMANIJAK, GOL_HR, INDEX_HR, SN } from './constants';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Seed MediaSource data
  await seedMediaSources();

  console.log('✅ Database seeding completed successfully!');
}

async function seedMediaSources() {
  console.log('📰 Seeding MediaSource entities...');

  const mediaSources = [
    {
      name: INDEX_HR,
      baseUrl: 'https://www.index.hr',
      urlPath: 'sport/rubrika/nogomet/1638.aspx',
    },
    {
      name: _24SATA,
      baseUrl: 'https://www.24sata.hr',
      urlPath: 'nogomet',
    },
    {
      name: SN,
      baseUrl: 'https://sportske.jutarnji.hr/sn',
      urlPath: 'nogomet',
    },
    {
      name: GOL_HR,
      baseUrl: 'https://www.gol.dnevnik.hr',
      urlPath: '',
    },
    {
      name: GERMANIJAK,
      baseUrl: 'https://www.germanijak.hr',
      urlPath: 'nogomet/1',
    },
  ];

  for (const mediaSourceData of mediaSources) {
    try {
      const existingMediaSource = await prisma.mediaSource.findFirst({
        where: { name: mediaSourceData.name },
      });

      if (!existingMediaSource) {
        const mediaSource = await prisma.mediaSource.create({
          data: mediaSourceData,
        });
        console.log(`Created MediaSource: ${mediaSource.name}`);
      } else {
        console.log(`MediaSource already exists: ${mediaSourceData.name}`);
      }
    } catch (error) {
      console.error(
        `Error creating MediaSource ${mediaSourceData.name}:`,
        error,
      );
    }
  }

  console.log('MediaSource seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
