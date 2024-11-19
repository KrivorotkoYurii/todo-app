import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  loadingTodoIds: number[];
  onDelete: (todoId: number) => void;
  toggleTodo: (todoId: number, updates: Partial<Todo>) => void;
  setEditingTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  renameTodo: (
    todoId: number,
    updateChanges: string,
    todoTitle: string,
  ) => void;
  editingTodo: Todo | null;
}

export const TodoItem: React.FC<Props> = ({
  loadingTodoIds,
  todo,
  onDelete,
  toggleTodo,
  renameTodo,
  editingTodo,
  setEditingTodo,
}) => {
  const [updateChanges, setUpdateChanges] = useState('');

  const { id, title } = todo;

  const isBeingEdited = editingTodo?.id === id;

  const editingField = useRef<HTMLInputElement>(null);

  const handleToggleTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updates = {
      completed: event.target.checked,
    };

    toggleTodo(id, updates);
  };

  const handleRenameTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    renameTodo(id, updateChanges, title);
  };

  if (editingTodo) {
    document.addEventListener('keyup', event => {
      if (event.key === 'Escape') {
        setEditingTodo(null);
        setUpdateChanges(todo.title);
      }
    });
  }

  useEffect(() => {
    if (isBeingEdited) {
      editingField.current?.focus();
    }
  }, [isBeingEdited]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          type="checkbox"
          data-cy="TodoStatus"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleTodo}
        />
      </label>

      {isBeingEdited ? (
        <form onSubmit={handleRenameTodo}>
          <input
            type="text"
            ref={editingField}
            value={updateChanges}
            data-cy="TodoTitleField"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onBlur={() => renameTodo(id, updateChanges, title)}
            onChange={event => setUpdateChanges(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditingTodo(todo);
              setUpdateChanges(title);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodoIds.includes(todo.id),
        })}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
