// This function will be responsible for identifying the type of error that has been thrown and sending the relevant error response
export default function errorHandler(err, res) {
  let { name, status, field, message, code } = err

  // * ValidationError
  if (name === 'ValidationError'){
    const fields = Object.keys(err.errors)
    const responseBody = {}
    fields.forEach(field => {
      responseBody[field] = err.errors[field].message
    })
    return res.status(422).json(responseBody)
  }

  // * Unique field constraint error
  if (name === 'MongoServerError' && code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    // Send a unique constraint error
    return res.status(422).json({ [field]: `${field} is already taken` })
  }
  
  // * All custom error responses
  return res.status(status).json({ [field]: message })
}