"use client";
import React, { createContext, useContext, useState } from "react";

const TwoFAModalContext = createContext();

export function TwoFAModalProvider({ children }) {
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [twoFAError, setTwoFAError] = useState("");
  const [onVerify, setOnVerify] = useState(() => () => {});

  const open2FAModal = ({ qrCode, secret, onVerify }) => {
    setQrCode(qrCode);
    setTotpSecret(secret);
    setOnVerify(() => onVerify);
    setShow2FAModal(true);
    setTwoFAError("");
  };

  const close2FAModal = () => {
    setShow2FAModal(false);
    setQrCode("");
    setTotpSecret("");
    setTwoFAError("");
    setTwoFALoading(false);
  };

  return (
    <TwoFAModalContext.Provider
      value={{
        show2FAModal,
        qrCode,
        totpSecret,
        twoFALoading,
        twoFAError,
        setTwoFAError,
        setTwoFALoading,
        open2FAModal,
        close2FAModal,
        onVerify,
      }}
    >
      {children}
    </TwoFAModalContext.Provider>
  );
}

export function useTwoFAModal() {
  return useContext(TwoFAModalContext);
}
