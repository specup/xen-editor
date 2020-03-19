import React, { useRef } from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { makeStyles } from '@material-ui/core/styles'
import 'bulma/css/bulma.css'
import axios from 'axios'

import Editor, { EditorAPI, EditorProps } from '../src/components/Editor'
import '../src/style.scss'
import exampleDocument from './example-document'

const EDITOR_CLASS_NAME = 'editor'

const useStyles = makeStyles({
  editor: {
    [`& .${EDITOR_CLASS_NAME}`]: {
      minHeight: 300,
      maxWidth: 842,
    },
  },
})

async function createUploadURL(contentType: string) {
  const response = await axios.post('http://localhost:4000/graphql', {
    query: `
      mutation ($contentType: String!) {
        postPrepareAttachmentUpload(postID: 179, contentType: $contentType) {
          attachment {
            id
            url
          }
          signedURL
        }
      }
    `,
    variables: {
      contentType,
    },
  })

  const {
    signedURL,
    attachment,
  } = response.data.data.postPrepareAttachmentUpload

  return {
    putURL: signedURL,
    getURL: attachment.url,
    meta: attachment.id,
  }
}

async function completeUpload(meta: any[]) {
  console.log(meta)
}

const EditorContainer: React.FC<Partial<EditorProps>> = props => {
  const ref = useRef<EditorAPI>(null)
  const classes = useStyles()

  return (
    <>
      <button
        onClick={() => {
          action('html')(ref.current && ref.current.html())
        }}
      >
        Show current HTML
      </button>
      <button
        onClick={() => {
          action('text')(ref.current && ref.current.text())
        }}
      >
        Show current TEXT
      </button>

      <button
        onClick={() => {
          action('set content')(ref.current && ref.current.setContent('<p><b>I am</b> <em>set</em></p>'))
        }}
      >
        set content
      </button>

      <button
        onClick={() => {
          action('append content')(ref.current && ref.current.appendContent('<p><b>I am</b> <em>appended</em></p>'))
        }}
      >
        append content
      </button>

      <button
        onClick={() => {
          action('clear state')(ref.current && ref.current.clearState())
        }}
      >
        clear state
      </button>

      <Editor
        className={classes.editor}
        editorClassName={EDITOR_CLASS_NAME}
        onChange={view => {
          console.log(view)
        }}
        createUploadURL={createUploadURL}
        completeUpload={completeUpload}
        {...props}
        ref={ref}
        onBlur={() => console.log('onBlur')}
        onFocus={() => console.log('onFocus')}
      />
    </>
  )
}

storiesOf('Basic', module)
  .add('basic', () => <EditorContainer initialValue={exampleDocument} />)
  .add('placeholder', () => (
    <EditorContainer placeholder="What would you like to say?" />
  ))
