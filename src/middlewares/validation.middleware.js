module.exports = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({ ok: false, message: 'Validación falló', details: error.details });
  }
  req[property] = value;
  next();
};
