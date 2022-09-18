import isEQ from '../checks/isEQ';
import mustSatisfy from '../checks/mustSatisfy';

/**
 * @hidden
 */
export default function mustBeEQ(name: string, value: number, limit: number, contextBuilder?: () => string): number {
    mustSatisfy(name, isEQ(value, limit), () => {
        return `be equal to ${limit}`;
    }, contextBuilder);
    return value;
}
