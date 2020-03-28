/**
 * Render context.
 */
enum RenderContext {
  NONE, OBJECT, SEQUENCE
}

/**
 * Render array-like structure.
 */
function renderArray(subject: any[], prefix: string, indent: string, context: RenderContext) {
  // Ignore empty array
  if (!subject.length) {
    return "";
  }
  // Render every element on it's own line
  return (context !== RenderContext.NONE ? "\n" + indent : "") + subject
      .map(value => "-" + renderValue(value, " ", indent + "  ", RenderContext.SEQUENCE))
      .join("\n" + indent);
}

/**
 * Render object-like structure.
 */
function renderObject(subject: any, prefix: string, indent: string, context: RenderContext) {
  // Remove NULL values
  const props = Object.entries(subject).filter(prop => prop[1] !== null);
  // Render every property on it's own line
  return (context === RenderContext.OBJECT ? "\n" + indent : prefix) + props
      .map(([name, value]) => name + ":" + renderValue(value, " ", indent, RenderContext.OBJECT))
      .join("\n" + indent);
}

/**
 * Render generic value.
 */
function renderValue(subject: any, prefix: string, indent: string, context = RenderContext.NONE) {
  if (Buffer.isBuffer(subject)) {
    return prefix + "[" + subject.toString("hex") + "]";
  } else if (Array.isArray(subject)) {
    return renderArray(subject, prefix, indent, context);
  } else if (typeof subject === "object") {
    return renderObject(subject, prefix, context === RenderContext.OBJECT ? indent + "  " : indent, context);
  } else {
    return prefix + subject.toString();
  }
}

/**
 * Render value in a YAML-like structure. 
 */
export default function renderYamlLike(subject: any): string {
  return renderValue(subject, "", "");
}
