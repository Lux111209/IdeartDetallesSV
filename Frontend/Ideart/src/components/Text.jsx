// src/components/Text.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const Text = ({ children }) => {
  const { t } = useTranslation();
  return <>{t(children)}</>;
};

export default Text;
