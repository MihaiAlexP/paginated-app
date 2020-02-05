const URL = 'http://nyx.vima.ekt.gr:3000/api/books';

export const fetchData = async (data = {}, url = URL) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};
