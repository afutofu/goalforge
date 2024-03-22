import React, { type ReactNode, type FC } from 'react';

interface IModal {
  children: string | ReactNode;
  onClose: () => void;
  className?: string;
}

export const Modal: FC<IModal> = ({ children, onClose, className = '' }) => {
  return (
    <div
      className="absolute top-0 left-0 w-screen h-screen z-50 flex justify-center items-center"
      onClick={onClose}
    >
      {children}
    </div>
  );
};
