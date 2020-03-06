import React, { useRef } from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";
import "bulma/css/bulma.css";
import axios from "axios";

import Editor, { EditorAPI, EditorProps } from "../src/components/Editor";
import "../src/style.scss";
import exampleDocument from "./example-document";

const EDITOR_CLASS_NAME = "editor";

const StyledEditor = styled(Editor).attrs({
  editorClassName: EDITOR_CLASS_NAME
})`
  .${EDITOR_CLASS_NAME} {
    min-height: 300px;
    max-width: 842px;
  }
`;

async function createUploadURL(contentType: string) {
  const response = await axios.post("http://localhost:4000/graphql", {
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
      contentType
    }
  });

  const {
    signedURL,
    attachment
  } = response.data.data.postPrepareAttachmentUpload;

  return {
    putURL: signedURL,
    getURL: attachment.url,
    meta: attachment.id
  };
}

async function completeUpload(attachmentID: string) {
  await axios.post("http://localhost:4000/graphql", {
    query: `
      mutation ($attachmentID: ID!) {
        postCompleteAttachmentUpload(attachmentID: $attachmentID) {
          attachment {
            id
            post {
              id
              attachments {
                id
              }
            }
          }
        }
      }
    `,
    variables: {
      attachmentID
    }
  });
}

const EditorContainer: React.FC<Partial<EditorProps>> = props => {
  const ref = useRef<EditorAPI>(null);

  return (
    <>
      <button
        onClick={() => {
          action("html")(ref.current && ref.current.html());
        }}
      >
        Show current HTML
      </button>
      <button
        onClick={() => {
          console.log(ref.current && ref.current.text());
          action("text")(ref.current && ref.current.text());
        }}
      >
        Show current TEXT
      </button>

      <StyledEditor
        onChange={view => {
          console.log(view);
        }}
        createUploadURL={createUploadURL}
        completeUpload={completeUpload}
        {...props}
        ref={ref}
      />
    </>
  );
};

storiesOf("Basic", module)
  .add("basic", () => <EditorContainer initialValue={exampleDocument} />)
  .add("placeholder", () => (
    <EditorContainer placeholder='What would you like to say?' />
  ));
