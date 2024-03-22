import React, { type FC } from 'react';
import clsx from 'clsx';

interface IButton extends React.ComponentPropsWithoutRef<'button'> {
  children: string;
  small?: boolean;
  selected?: boolean;
  className?: string;
}

export const Button: FC<IButton> = ({
  children,
  small,
  selected,
  className,
  ...props
}) => {
  return (
    <button
      className={
        clsx(
          'bg-secondary rounded-full inline uppercase flex justify-center items-center text-white hover:bg-primary shadow-md transition ',
          { 'py-1 px-3': small },
          { 'py-2 px-5': !(small ?? false) },
          { '!bg-primary': selected },
        ) + (className != null ? ' ' + className : '')
      }
      {...props}
    >
      <span className={'font-bold ' + (small != null ? 'text-2xs' : 'text-xs')}>
        {children}
      </span>
    </button>
  );
};
