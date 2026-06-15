export const decodeQueryString = <T>(queryString: string) => {
  const params = new URLSearchParams(queryString);
  const decodedParams = Object.fromEntries(params.entries());
  return decodedParams as T;
};
