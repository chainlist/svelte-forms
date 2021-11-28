export type Validation = { valid: boolean; name: string };

export type Validator<T> = (...args: any[]) => Validation | Promise<Validation>;
