import { type ICategory } from '@/types';
import clsx from 'clsx';
import React, { useState, type FC, useRef, useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Button } from './Button';
import { useCategoryStore } from '@/store/category';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/api';
import { categoryEndpoint } from '@/api/endpoints';
import { type IEditCategoryMutation } from '@/api/responseTypes';
import { useAuthStore } from '@/store/auth';

interface ICategoryItem extends React.ComponentPropsWithoutRef<'div'> {
  category: ICategory;
}

interface IFormInput {
  name: string;
  color: string;
}

export const CategoryItem: FC<ICategoryItem> = ({ category, ...props }) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty },
  } = useForm<IFormInput>({
    defaultValues: {
      name: category.name,
      color: category.color,
    },
  });

  const { setCategories, editCategory, deleteCategory } = useCategoryStore();

  const queryClient = useQueryClient();

  // Edit category
  const { mutate: mutateEditCategory } = useMutation({
    mutationFn: async ({ categoryID, category }: IEditCategoryMutation) => {
      const URL = `${categoryEndpoint.editCategory}`.replace(
        ':categoryID',
        categoryID,
      );
      return await api.put(URL, category);
    },
    onMutate: async ({ categoryID, category }: IEditCategoryMutation) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });

      // Snapshot the previous value
      const previousCategories: ICategory[] | undefined =
        queryClient.getQueryData(['categories']);

      // Optimistically delete the category from Zustand state
      editCategory(categoryID, category);

      return { previousCategories };
    },
    onError: (_error, _variables, context) => {
      // Rollback the optimistic update
      if (context?.previousCategories != null) {
        setCategories(context.previousCategories);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  // Delete category
  const { mutate: mutateActivityLogDelete } = useMutation({
    mutationFn: async (categoryID) => {
      const URL = `${categoryEndpoint.deleteCategory}`.replace(
        ':categoryID',
        categoryID,
      );
      return await api.delete(URL);
    },
    onMutate: async (categoryID: string) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });

      // Snapshot the previous value
      const previousCategories: ICategory[] | undefined =
        queryClient.getQueryData(['categories']);

      // Optimistically delete the category from Zustand state
      deleteCategory(categoryID);

      return { previousCategories };
    },
    onError: (_error, _variables, context) => {
      // Rollback the optimistic update
      // TODO: Implement rollback based on error message.
      // If 404 activity category not found, remove from zustand state.
      // If 500, set state back to previous logs.
      if (context?.previousCategories != null) {
        setCategories(context.previousCategories);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const { ref } = register('name');

  const onSubmit: SubmitHandler<IFormInput> = (data, e) => {
    e?.preventDefault();
    const editedLog: ICategory = {
      ...category,
      name: data.name,
      color: data.color,
    };

    console.log(isDirty);
    if (data.name !== category.name) {
      if (isAuth) {
        mutateEditCategory({
          categoryID: category.id,
          category: editedLog,
        });
      } else {
        editCategory(category.id, editedLog);
      }
    }

    reset();
    setOpen(false);
  };

  useEffect(() => {
    if (open && inputRef.current !== null) inputRef.current.focus();
    setValue('name', category.name);
  }, [open]);

  return (
    <div
      className={clsx(
        'flex items-center cursor-pointer rounded-lg w-full transition-all duration-200 ease-in-out',
        { 'mb-1': !open },
        { 'mb-2': open },
      )}
      {...props}
    >
      <div
        className={clsx('flex w-full items-center', { hidden: open })}
        onClick={() => {
          setOpen(true);
        }}
      >
        <span>{category.name}</span>
        <div
          className="w-[15px] h-[15px] border-[1px] border-black ml-auto"
          style={{ background: category.color }}
        ></div>
      </div>

      <form
        className={clsx(
          'cursor-auto name-black flex flex-col items-start w-full z-20 bg-white rounded-lg w-full shadow-md p-3',
          { hidden: !open },
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex">
          <input
            className="outline-none mb-3 w-full p-1"
            {...register('name', { required: true, minLength: 1 })}
            ref={(e) => {
              ref(e);
              inputRef.current = e;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void handleSubmit(onSubmit)();
              }
            }}
          />
          <input type="color" {...register('color')} />
        </div>

        <div className="flex justify-between items-center w-full">
          <button
            className="mr-4 hover:underline text-gray-400"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isAuth) {
                mutateActivityLogDelete(category.id);
              } else {
                deleteCategory(category.id);
              }
              setOpen(false);
            }}
          >
            Delete
          </button>
          <div className="flex items-center">
            <button
              className="mr-4 hover:underline text-gray-400"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
              }}
            >
              Cancel
            </button>
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                void handleSubmit(onSubmit)();
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
