export const stripDatabaseDatesFromEntity = (entity: any) => {
  const { updated_at, created_at, ...newEntity } = entity;
  return newEntity;
}

export const stripPasswordFromEntity = (entity: any) => {
  const { password, ...newEntity } = entity;
  return newEntity;
}

export const normalizeEmail = (email: string) => {
  return email.trim().toLowerCase();
}

