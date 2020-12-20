const color = {
  hex: 'red',
};

const getSwatches = () => {
  return Promise.resolve({
    Vibrant: color,
    Muted: color,
  });
};

const from = (img: any) => {
  return { getSwatches };
};

const Vibrant = {
  from,
};

export default Vibrant;
