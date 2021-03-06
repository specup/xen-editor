// Refer to: https://github.com/ProseMirror/prosemirror/issues/90

import { Plugin } from 'prosemirror-state'
import { Slice, Fragment } from 'prosemirror-model'
import { Node } from '../types'

let LinkPlugin = new Plugin({
  props: {
    transformPasted: (slice: Slice) => {
      return new Slice(linkify(slice.content), slice.openStart, slice.openEnd)
    },
  },
})

const HTTP_LINK_REGEX = /\b(https|http)?:\/\/\S+/g
let linkify = (fragment: Fragment): Fragment => {
  var linkified: Node[] = []
  fragment.forEach((child: Node) => {
    if (child.isText) {
      const text = child.text as string
      var pos = 0,
        match

      while ((match = HTTP_LINK_REGEX.exec(text))) {
        var start = match.index
        var end = start + match[0].length
        var link = child.type.schema.marks['link']

        // simply copy across the text from before the match
        if (start > 0) {
          linkified.push(child.cut(pos, start))
        }

        const urlText = text.slice(start, end)
        linkified.push(
          child
            .cut(start, end)
            .mark(link.create({ href: urlText }).addToSet(child.marks)),
        )
        pos = end
      }

      // copy over whatever is left
      if (pos < text.length) {
        linkified.push(child.cut(pos))
      }
    } else {
      linkified.push(child.copy(linkify(child.content)))
    }
  })

  return Fragment.fromArray(linkified)
}

export default LinkPlugin
