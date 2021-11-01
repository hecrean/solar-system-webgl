// HMJ
export type ResourceKey = 'mars' | 'earth' | 'moon' | 'sun';
export type ResourceValue<T> = {
  diffuse_map: T;
  displacement_map: T;
};
export type Resource<T> = { [key in ResourceKey]: ResourceValue<T> };
