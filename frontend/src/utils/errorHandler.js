export const handleApiError = (err, showError) => {
  let msg;

  const errors = err.response?.data?.errors;

  if (Array.isArray(errors)) {
    // errors returned as array of strings
    msg = errors.join('; ');
  } else if (errors && typeof errors === 'object') {
    // errors returned as object { field: [messages] }
    msg = Object.keys(errors)
      .map((field) => {
        const messages = Array.isArray(errors[field]) ? errors[field] : [errors[field]];
        return `${field.charAt(0).toUpperCase() + field.slice(1)} ${messages.join(', ')}`;
      })
      .join('; ');
  } else {
    msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Something went wrong';
  }

  if (showError) showError(msg);
  return msg;
};
