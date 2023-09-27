import axios from 'axios';

export async function creareApiGet(keyForSearch, page) {
  const config = {
    key: '39626156-66db482f06efda0b43f7ab67e',
    q: keyForSearch,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: page,
  };

  try {
    const apiInstance = await axios.get('https://pixabay.com/api/', {
      params: config,
    });
    return apiInstance.data;
  } catch (error) {
    console.error(error);
  }
}
