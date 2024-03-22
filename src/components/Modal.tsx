import React, { type ReactNode, type FC } from 'react';

interface IModal {
  children: string | ReactNode;
  onClose: () => void;
  className?: string;
}

export const Modal: FC<IModal> = ({ children, onClose, className = '' }) => {
  return (
    <div
      className="absolute top-0 left-0 w-screen z-30 h-screen flex justify-center items-center  "
      onClick={onClose}
    >
      <div className="absolute top-0 left-0 w-screen h-screen bg-black opacity-40"></div>
      {children}
    </div>
  );
};
