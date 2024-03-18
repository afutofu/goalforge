import React, { type FC } from 'react';

interface ButtonProps {
  children: string;
  small?: boolean;
  containerClass?: string;
}

export const Button: FC<ButtonProps> = ({
  children,
  small,
  containerClass,
}) => {
  return (
    <button
      className={
        'bg-secondary rounded-full inline  uppercase flex justify-center align-center ' +
        (small != null ? 'py-1 px-3 ' : 'py-2 px-5 ') +
        (containerClass ?? '')
      }
    >
      <span className={'font-bold ' + (small != null ? 'text-2xs' : 'text-xs')}>
        {children}
      </span>
    </button>
  );
};
