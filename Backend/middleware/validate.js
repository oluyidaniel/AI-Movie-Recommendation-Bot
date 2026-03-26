/**
 * Express middleware factory — validates req.body against a Zod schema.
 * Usage: router.post('/route', validate(MySchema), handler)
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return res.status(400).json({ error: message });
    }
    req.body = result.data;
    next();
  };
}
