import React, { type ReactNode, type FC } from 'react';

interface IModal {
  children: string | ReactNode;
  isOpen?: boolean;
  onClose: () => void;
  className?: string;
}

export const Modal: FC<IModal> = ({
  children,
  isOpen,
  onClose,
  className = '',
}) => {
  return (
    <div
      className="absolute top-0 left-0 w-screen h-screen z-50 flex justify-center items-center"
      onClick={onClose}
    >
      {children}
    </div>
  );
};
