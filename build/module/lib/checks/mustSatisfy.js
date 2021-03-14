/**
 * @hidden
 */
export default function mustSatisfy(name, condition, messageBuilder, contextBuilder) {
    if (!condition) {
        doesNotSatisfy(name, messageBuilder, contextBuilder);
    }
}
/**
 * @hidden
 * @param name
 * @param messageBuilder
 * @param contextBuilder
 */
export function doesNotSatisfy(name, messageBuilder, contextBuilder) {
    var message = messageBuilder ? messageBuilder() : "satisfy some condition";
    var context = contextBuilder ? " in " + contextBuilder() : "";
    throw new Error(name + " must " + message + context + ".");
}
