import { createContext, useState } from "react";

export const ErrorContext = createContext();

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null);

  const showError = (message) => setError(message);
  const clearError = () => setError(null);
  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
      {children}
      {error && (
        <div className="global-error-banner">
          <span>{error}</span>
          <button onClick={clearError}>&times;</button>
        </div>
      )}
    </ErrorContext.Provider>
  );
}
