export const fetchData = async () => {
  const response = await fetch("", options);
  const data = await response.json();
  return data;
};
