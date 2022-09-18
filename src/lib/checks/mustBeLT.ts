import isLT from '../checks/isLT';
import mustSatisfy from '../checks/mustSatisfy';

/**
 * @hidden
 */
export default function (name: string, value: number, limit: number, contextBuilder?: () => string): number {
    mustSatisfy(name, isLT(value, limit), () => {
        return `be less than ${limit}`;
    }, contextBuilder);
    return value;
}
