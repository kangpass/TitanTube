import axios from 'axios';

const BASE_URL = 'https://yt-api.p.rapidapi.com';

const options = {
  params: {
    geo: 'US',
    lang: 'en'
  },
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
    'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST,
  },
};

export const fetchFromAPI = async (url) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${url}`, options);
    return data;
  } catch (error) {
    console.error('Error fetching from API:', error);
    throw error;
  }
}; 