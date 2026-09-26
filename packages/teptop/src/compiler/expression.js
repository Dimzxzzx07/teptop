export const compileExpression = source => scope => Function('scope', `with (scope) { return (${source}); }`)(scope);
