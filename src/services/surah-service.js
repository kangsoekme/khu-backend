import { prismaClient } from "../application/database.js";

const getAllSurah = async () => {
  return await prismaClient.surah.findMany({
    orderBy: { no_surah: "asc" },
  });
};

export default { getAllSurah };
