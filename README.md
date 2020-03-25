# XEN Editor

XEN editor는 (아직은) 스펙업 내부 서비스에서 사용하기 위해 만들어진 react, prosemirror 기반의 에디터입니다.

## Installation

```bash
$ yarn add xen-editor
```

### Peer Dependencies

```bash
$ yarn add react bulma
```

## Usage

```jsx
import 'bulma/css/bulma.css'
import 'xen-editor/dist/style.css'
import { Editor } from 'xen-editor'

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
