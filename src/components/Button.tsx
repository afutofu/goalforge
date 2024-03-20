import React, { type FC } from 'react';

interface IButton extends React.ComponentPropsWithoutRef<'button'> {
  children: string;
  small?: boolean;
  containerClass?: string;
}

export const Button: FC<IButton> = ({
  children,
  small,
  containerClass,
  ...props
}) => {
  return (
    <button
      className={
        'bg-secondary rounded-full inline uppercase flex justify-center items-center text-white ' +
        (small != null ? 'py-1 px-3 ' : 'py-2 px-5 ') +
        (containerClass ?? '')
      }
      {...props}
    >
      <span className={'font-bold ' + (small != null ? 'text-2xs' : 'text-xs')}>
        {children}
      </span>
    </button>
  );
};
