import { conform } from '@conform-to/react';
import { useTruthy } from '@lib/hooks/useTruthy';
import { cn } from '@lib/utils';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { BubbleMenu, EditorContent, FloatingMenu, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import { forwardRef, useImperativeHandle, type ForwardedRef } from 'react';
import { SwitchTransition } from 'transition-hook';
import Label from './Label';
import Button from './Button';

interface Props {
  name?: string;
  id?: string;
  defaultValue?: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  labelClassName?: string;
  inputClassName?: string;
  editorClassName?: string;
  placeholder?: string;
  editable?: boolean;
}

export interface TextEditorCommands {
  clearContent: () => void;
}

const extensions = [
  StarterKit,
  Link,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
];

function TextEditor(
  {
    name,
    id,
    defaultValue,
    label,
    labelClassName,
    editorClassName,
    errorMessage,
    description,
    placeholder,
    editable = true,
  }: Props,
  ref: ForwardedRef<TextEditorCommands>
) {
  const editor = useEditor({
    extensions: [...extensions, Placeholder.configure({ placeholder })],
    editorProps: {
      attributes: { class: clsx('c-text-editor prose max-w-none prose-primary', editorClassName), id: id! },
    },
    content: defaultValue,
    editable,
  });
  const invalid = !!errorMessage;
  const err = useTruthy(errorMessage);
  useImperativeHandle(
    ref,
    () => ({
      clearContent() {
        editor?.commands.clearContent();
      },
    }),
    [editor]
  );

  function ToolMenu() {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          outlined
          variant="primary"
          onPress={() => editor!.chain().focus().setTextAlign('left').run()}
          isDisabled={editor!.isActive({ textAlign: 'left' })}
          className="px-2 py-1 shadow"
        >
          Left
        </Button>
        <Button
          outlined
          variant="primary"
          onPress={() => editor!.chain().focus().setTextAlign('center').run()}
          isDisabled={editor!.isActive({ textAlign: 'center' })}
          className="px-2 py-1 shadow"
        >
          Center
        </Button>
        <Button
          outlined
          variant="primary"
          onPress={() => editor!.chain().focus().setTextAlign('right').run()}
          isDisabled={editor!.isActive({ textAlign: 'right' })}
          className="px-2 py-1 shadow"
        >
          Right
        </Button>
        <Button
          outlined
          variant="primary"
          onPress={() => editor!.chain().focus().setTextAlign('justify').run()}
          isDisabled={editor!.isActive({ textAlign: 'justify' })}
          className="px-2 py-1 shadow"
        >
          Justify
        </Button>
      </div>
    );
  }

  return (
    <div>
      {label ? (
        <Label
          className={cn('mb-0.5 flex items-center gap-1 flex-wrap', labelClassName)}
          onClick={() => {
            editor?.commands.focus();
          }}
          htmlFor={id}
        >
          {label}
        </Label>
      ) : null}
      {!editor ? <div className={'c-text-editor ' + editorClassName} /> : <EditorContent editor={editor} />}
      <SwitchTransition state={invalid} timeout={200} mode="out-in">
        {(invalid, stage) => (
          <div
            className={clsx(
              'transition-opacity duration-200 text-sm',
              {
                from: 'opacity-0 ease-in',
                enter: '',
                leave: 'opacity-0 ease-out',
              }[stage]
            )}
          >
            {invalid ? (
              <span className="text-negative-500">{err + (err.at(-1) === '.' ? '' : '.')}</span>
            ) : description ? (
              <span className="text-primary-700">{description + (description.at(-1) === '.' ? '' : '.')}</span>
            ) : null}
          </div>
        )}
      </SwitchTransition>
      {editor ? (
        <>
          <FloatingMenu editor={editor} tippyOptions={{ duration: 150 }}>
            <ToolMenu />
          </FloatingMenu>
          <BubbleMenu editor={editor} tippyOptions={{ duration: 150 }} className="bg-primary-0 p-1 rounded">
            <ToolMenu />
          </BubbleMenu>
          {name ? (
            <input {...conform.input({ name }, { type: 'text', hidden: true })} value={editor.getHTML()} readOnly />
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export default forwardRef(TextEditor);
