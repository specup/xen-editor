// https://discuss.prosemirror.net/t/how-to-input-like-placeholder-behavior/705/10
import { Plugin, PluginKey } from 'prosemirror-state'
import { DecorationSet, Decoration } from 'prosemirror-view'

function PlaceholderPlugin(text) {
  return new Plugin({
    key: new PluginKey('placeholder'),
    props: {
      decorations: state => {
        let doc = state.doc
        if (
          doc.childCount > 1 ||
          (doc.firstChild &&
            (!doc.firstChild.isTextblock || doc.firstChild.content.size > 0))
        ) {
          return
        }

        let placeholder = document.createElement('span')
        placeholder.classList.add('editor-placeholder')
        placeholder.innerHTML = text

        return DecorationSet.create(doc, [Decoration.widget(1, placeholder)])
      },
    },
  })
}

export default PlaceholderPlugin
