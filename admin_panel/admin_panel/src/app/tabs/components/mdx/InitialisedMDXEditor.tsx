'use client'
import type { ForwardedRef } from 'react'
import '@mdxeditor/editor/style.css'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  imagePlugin,
  MDXEditor,
  CodeToggle,
  CreateLink,
  InsertCodeBlock,
  InsertImage,
  InsertSandpack,
  type MDXEditorMethods,
  type MDXEditorProps,
  DiffSourceToggleWrapper,
  diffSourcePlugin,
  jsxPlugin,
  ConditionalContents,
  codeBlockPlugin,
  sandpackPlugin,
  linkPlugin,
  linkDialogPlugin,
} from '@mdxeditor/editor'
import { UndoRedo, BoldItalicUnderlineToggles, toolbarPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { ChangeCodeMirrorLanguage, ShowSandpackInfo, codeMirrorPlugin } from '@mdxeditor/editor'
import { SandpackConfig } from '@mdxeditor/editor'
import './mdx.css'

export default function InitializedMDXEditor({
  editorRef,
  unedited_original_text="",
  ...props
}: { unedited_original_text: string, editorRef: ForwardedRef<MDXEditorMethods> } & MDXEditorProps) {

  // this is the default content for the sandpack editor, defined above
  const defaultSnippetContent = `
    export default function App() {
      return (
        <div className="App">
          <h1>Hello CodeSandbox</h1>
          <h2>Start editing to see some magic happen!</h2>
        </div>
      );
    }
    `.trim()

  // this is the default content for the sandpack editor
  // The sandpack editor is a live editor that allows you to run code
  const simpleSandpackConfig: SandpackConfig = {
    defaultPreset: 'react',
    presets: [
      {
        label: 'React',
        name: 'react',
        meta: 'live react',
        sandpackTemplate: 'react',
        sandpackTheme: 'light',
        snippetFileName: '/App.js',
        snippetLanguage: 'jsx',
        initialSnippetContent: defaultSnippetContent
      },
    ]
  }

  return (
    <div className='w-full max-w-3xl h-full dark-theme dark-editor'>
      <MDXEditor
          className={`h-full overflow-y-scroll max-h-[50rem]`}
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            imagePlugin(),
            diffSourcePlugin({diffMarkdown:unedited_original_text, viewMode: 'rich-text'}),
            jsxPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            codeBlockPlugin({defaultCodeBlockLanguage: 'js'}),
            sandpackPlugin({sandpackConfig: simpleSandpackConfig}),
            codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript' } }),
            toolbarPlugin({
              toolbarClassName: 'my-classname',
              toolbarContents: () => (
                <>
                  {' '}
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  {' '}
                  <CodeToggle />
                  <CreateLink />
                  {' '}
                  <InsertCodeBlock />
                  <InsertImage />
                  {' '}
                  <DiffSourceToggleWrapper>
                    <UndoRedo/>
                  </DiffSourceToggleWrapper>
                  {' '}
                  <ConditionalContents
                    options={[
                      { when: (editor: any) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
                      { when: (editor: any) => editor?.editorType === 'sandpack', contents: () => <ShowSandpackInfo /> },
                      { fallback: () => ( <> 
                        <InsertCodeBlock />
                        <InsertSandpack />
                      </>) }
                    ]}
                  />
                </>
              )
            })
          ]}
          {...props}
          ref={editorRef}
        />

    </div>
    

  )
}