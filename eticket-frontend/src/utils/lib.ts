export const ID_REGEX = /.{36}$/;
export const getIdFromSlug = (slug: string): string | null => {
  const match = slug.match(ID_REGEX);
  return match ? match[0] : null;
}