/**
 * @hidden
 */
export default function mustSatisfy(name: string, condition: boolean, messageBuilder: () => string, contextBuilder?: () => string): void;
/**
 * @hidden
 * @param name
 * @param messageBuilder
 * @param contextBuilder
 */
export declare function doesNotSatisfy(name: string, messageBuilder: () => string, contextBuilder?: () => string): never;
