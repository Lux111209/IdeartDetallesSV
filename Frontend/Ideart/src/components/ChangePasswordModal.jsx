import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../css/Profile.css';

const ChangePasswordModal = ({ user, setUser, onClose }) => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [error, setError] = useState('');

  const handleChange = () => {
    if (current !== '12345678') {
      setError(t('currentPasswordIncorrect'));
      return;
    }

    setUser({ ...user, password: '********' });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{t('changePassword')}</h3>
        <input
          type="password"
          placeholder={t('current')}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
        <input
          type="password"
          placeholder={t('new')}
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <div className="modal-actions">
          <button onClick={handleChange}>{t('update')}</button>
          <button onClick={onClose}>{t('cancel')}</button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
