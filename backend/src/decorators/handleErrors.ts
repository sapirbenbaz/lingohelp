import { handleNotionError } from "../services/notion/notionHelpers";

export function handleErrors(
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: unknown[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      console.error(`Error occured while executing: ${propertyKey}`);
      handleNotionError(error);
    }
  };
}
