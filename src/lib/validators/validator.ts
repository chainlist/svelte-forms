export type FieldValidation = { valid: boolean; name: string };
export type Validator = (value: any) => FieldValidation | Promise<FieldValidation>;

export type ValidatorFactory = (...args: any[]) => Validator | Promise<Validator>;
