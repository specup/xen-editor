# XEN Editor

Xen prosemirror editor

## Installation

### Peer Dependencies

```bash
yarn add react bulma
```

## Usage

```jsx
import 'bulma/css/bulma.css'
import '@specup/editor/dist/style.css'
import { Editor } from '@specup/editor'

const EditorContainer = () => {
  const ref = useRef(null)
  const [html, setHTML] = useState(null)

  function handlePrintClick() {
    if (ref.current) {
      setHTML(ref.current.html())
    }
  }

  return (
    <>
      <StyledEditor
        initialValue={`
          <p style="text-align: center">Buddy</p>
          <p>Hello</p>
          <p><span style="color: red;">World</span></p>
          <p style="margin-left: 40px">Indented</p>
        `}
        apiBaseURL="https://graphql.linkareer.com/graphql"
        ref={ref}
      />
      <button onClick={handlePrintClick}>Print</button>
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
    </>
  )
}
```

## Deploy

```sh
npm login
npm version <patch | major | minor...> && npm publish
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
