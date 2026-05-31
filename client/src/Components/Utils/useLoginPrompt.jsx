import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginRequiredModal, { isAuthRequiredError } from './LoginRequiredModal';

export { isAuthRequiredError };

export const UNAUTHORIZED_CREDENTIALS_MSG = "Unauthorized credentials";

export function useLoginPrompt() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const promptLogin = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  const loginModal = (
    <LoginRequiredModal
      show={showLoginModal}
      onHide={() => setShowLoginModal(false)}
      onLogin={() => {
        setShowLoginModal(false);
        navigate('/login');
      }}
    />
  );

  const redirectToLogin = useCallback((message) => {
    navigate('/login', {
      replace: true,
      state: { authError: message || undefined },
    });
  }, [navigate]);

  const handleAuthResponse = useCallback((errorOrResponse, options = {}) => {
    if (isAuthRequiredError(errorOrResponse)) {
      if (options.redirect) {
        redirectToLogin(options.authMessage);
      } else {
        promptLogin();
      }
      return true;
    }
    return false;
  }, [promptLogin, redirectToLogin]);

  return { promptLogin, redirectToLogin, loginModal, handleAuthResponse };
}
