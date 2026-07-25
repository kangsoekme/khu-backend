import 'dotenv/config';
import { prismaClient } from './src/application/database.js';

async function main() {
  console.log("Fetching surahs from quran API...");
  // Node 18+ has native fetch
  const response = await fetch('https://api.quran.com/api/v4/chapters');
  const data = await response.json();
  const chapters = data.chapters;

  console.log(`Found ${chapters.length} surahs. Seeding database...`);
  
  for (const chapter of chapters) {
    await prismaClient.surah.upsert({
      where: { no_surah: chapter.id },
      update: {
        nama_surah: chapter.name_simple,
        jumlah_ayat: chapter.verses_count
      },
      create: {
        no_surah: chapter.id,
        nama_surah: chapter.name_simple,
        jumlah_ayat: chapter.verses_count
      }
    });
  }
  
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
