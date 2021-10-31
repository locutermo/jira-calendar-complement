import api from "@forge/api";

export const getDataFromJira = async url => {
  try {
    const response = await api.asUser().requestJira(url);
    return await response.json();
  } catch (error) {
    console.log("getDataFromJira error: ", error);
    throw error;
  }
};

