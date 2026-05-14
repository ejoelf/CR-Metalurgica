export function sendSuccess(res, data = null, message = 'Operacion realizada correctamente', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function sendCreated(res, data = null, message = 'Recurso creado correctamente') {
  return sendSuccess(res, data, message, 201);
}
