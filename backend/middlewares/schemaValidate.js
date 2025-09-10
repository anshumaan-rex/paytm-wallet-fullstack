const inputValidation = (schema) => (req, res, next) => {
  try {
    const bodyPayload = schema.safeParse(req.body);
    if (!bodyPayload.success) {
      return res.status(400).json({
        success: false,
        message: "Input error",
        errors: bodyPayload.error.issues.map((issue) => ({
          path: issue.path[0],
          error: issue.message,
        })),
      });
    }
    req.userInputData = bodyPayload.data;
    next();
  } catch (err) {
    console.error("Error in input Validation schema");
    return res.status(500).json({
      error: "Server error. Please try again!", err });
  }
};

export default inputValidation;
