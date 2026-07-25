import surahService from "../services/surah-service.js";

const getAllSurah = async (req, res, next) => {
  try {
    const result = await surahService.getAllSurah();
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default { getAllSurah };
