import { EditorState, Node, Mark, MarkType, Dispatch, schema, Command } from '../../prosemirror'

export function markActive(state: EditorState, type: MarkType) {
  const { from, $from, to, empty } = state.selection
  return empty
    ? type.isInSet(state.storedMarks || $from.marks()) ? true : false
    : state.doc.rangeHasMark(from, to, type)
}

function marksAcross(state: EditorState, from: number, to: number, type: MarkType) {
  const marks: Mark[] = []

  if (to > from) {
    state.doc.nodesBetween(from, to, node => {
      for (const mark of node.marks) {
        if (mark.type === type) {
          marks.push(mark)
        }
      }
    })
  }

  return marks
}

export function getMarks(state: EditorState, type: MarkType) {
  const { from, to, $from, $to, empty } = state.selection

  const marks = empty
    ? state.storedMarks || $from.marks()
    : marksAcross(state, from, to, type)

  if (!marks) {
    return []
  }

  return marks.filter(mark => mark.type.name === type.name)
}

function getUniqueMarkValue<T>(state: EditorState, getValue: (marks: Mark[]) => T): T | null {
  const { from, to, $from, empty } = state.selection

  if (empty) {
    const marks = state.storedMarks || $from.marks()
    return getValue(marks)
  }

  let value: T | null = null
  let conflicted = false

  state.doc.nodesBetween(from, to, node => {
    if (conflicted) {
      return false
    }

    if (!node.isInline) {
      return
    }

    const foundValue = getValue(node.marks)

    if (value === foundValue) {
      return
    } else if (value === null) {
      value = foundValue
    } else {
      conflicted = true
      return false
    }
  })

  return conflicted ? null : value
}

const DEFAULT_FONT_FAMILY = 'Dotum'

export function getFontFamily(state: EditorState) {
  return getUniqueMarkValue<string>(state, marks => {
    const mark = marks.find(mark => mark.type === schema.marks.font_family)
    return mark ? mark.attrs.family : DEFAULT_FONT_FAMILY
  })
}

const DEFAULT_FONT_SIZE = 13

export function getFontSize(state: EditorState) {
  return getUniqueMarkValue<number>(state, marks => {
    const mark = marks.find(mark => mark.type === schema.marks.font_size)
    return mark ? mark.attrs.size : DEFAULT_FONT_SIZE
  })
}

const DEFAULT_FONT_COLOR = 'black'

export function getFontColor(state: EditorState) {
  return getUniqueMarkValue<string>(state, marks => {
    const mark = marks.find(mark => mark.type === schema.marks.font_color)
    return mark ? mark.attrs.color : DEFAULT_FONT_COLOR
  })
}

const DEFAULT_BACKGROUND_COLOR = '#ffffff'

export function getBackgroundColor(state: EditorState) {
  return getUniqueMarkValue<string>(state, marks => {
    const mark = marks.find(mark => mark.type === schema.marks.background_color)
    return mark ? mark.attrs.color : DEFAULT_BACKGROUND_COLOR
  })
}

export function setMark(markType: MarkType, attrs: any): Command {
  return (state, dispatch) => {
    const { empty, from, to } = state.selection
    const mark = markType.create(attrs)
    const tr = empty
      ? state.tr.addStoredMark(mark)
      : state.tr.addMark(from, to, mark)

    if (dispatch) {
      dispatch(tr)
    }

    return true
  }
}

export function removeMark(markType: MarkType) {
  return (state: EditorState, dispatch: Dispatch) => {
    const { empty, from, to } = state.selection
    const tr = empty
      ? state.tr.removeStoredMark(markType)
      : state.tr.removeMark(from, to, markType)

    return dispatch(tr)
  }
}

export function getNodeValues<T>(state: EditorState, getter: (node: Node) => T) {
  const result = new Set<T>()

  const { from, to } = state.selection
  state.doc.nodesBetween(from, to, (node, pos) => {
    const attr = getter(node)

    if (attr !== undefined) {
      result.add(attr)
    }
  })

  return result
}

export function getNodeUniqueValue<T>(state: EditorState, getter: (node: Node) => T) {
  const values = getNodeValues(state, getter)

  return values.size === 1
    ? values.values().next().value
    : null
}

// export function mutateNodes(type: MarkType, attrs: any) {
//   return (state: EditorState, dispatch: Dispatch) => {
//     console.log('state', state)
//     const { $from, from, to, $to, empty } = state.selection
//     console.log('selection', from, to)

//     let range = $from.blockRange($to)
//     if (!range) {
//       return
//     }

//     console.log('range', range, range.start, range.end)

//     let content = state.doc.content.cut(range.start, range.end)

//     for (let i = 0; i < content.childCount; ++i) {
//       const child = content.child(i)
//       // const mark = child.marks.filter(mark => mark.type.name === type.name)
//       const marks = type.create(attrs).addToSet(child.marks)
//       content = content.replaceChild(i, child.mark(marks))
//     }

//     console.log('content to apply', content)

//     const tr = state.tr.replaceWith(range.start, range.end, content)
//       // .setSelection(state.selection)
//     // tr.scrollIntoView()
//     const result = dispatch(tr)
//     console.log(result)

//     // state.doc.nodesBetween(range.start, range.end, (node, pos, parent) => {
//     //   if (!node.isBlock) {
//     //     return
//     //   }

//     //   const mark = node.marks.find(mark => mark.type.name === type.name)
//     //   console.log(mark, node.marks)
//     //   if (mark) {
//     //     console.log(mark.attrs)
//     //   } else {
//     //   }

//     //   tr.addMark(pos, pos + node.nodeSize, type.create(attrs))
//     //   // if (!node.isInline) return
//     //   // let marks = node.marks
//     //   // if (!mark.isInSet(marks) && parent.type.allowsMarkType(mark.type)) {
//     //   //   let start = Math.max(pos, from), end = Math.min(pos + node.nodeSize, to)
//     //   //   let newSet = mark.addToSet(marks)

//     //   //   for (let i = 0; i < marks.length; i++) {
//     //   //     if (!marks[i].isInSet(newSet)) {
//     //   //       if (removing && removing.to == start && removing.mark.eq(marks[i]))
//     //   //         removing.to = end
//     //   //       else
//     //   //         removed.push(removing = new RemoveMarkStep(start, end, marks[i]))
//     //   //     }
//     //   //   }

//     //   //   if (adding && adding.to == start)
//     //   //     adding.to = end
//     //   //   else
//     //   //     added.push(adding = new AddMarkStep(start, end, mark))
//     //   // }
//     // })


//     // // let tr = state.tr

//     // // const node = $from.node()
//     // // const mark = node.marks.find(a => a.type.name === type.name)
//     // // if (mark) {

//     // // } else {

//     // // }

//     // // tr = tr.addMark(range.start , nodeSize, type.create(attrs))
//     // // // state.selection.replaceWith()
//     // dispatch(tr)
//     // // // const node = $from.node()
//     // // // node.mark
//     // // // console.log($from.node())
//   }
// }

// // export function mutateNodes(type: MarkType, attrs: any) {
// //   return (state: EditorState, dispatch: Dispatch) => {
// //     const { from, to, empty } = state.selection

// //     if (empty || true) {

// //     }

// //     let nextNodes: Node[] = []

// //     state.doc.nodesBetween(from, to, node => {
// //       const nextMarks: Mark[] = []
// //       for (const mark of node.marks) {
// //         if (mark.type.name === type.name) {

// //         } else {
// //           nextMarks.push(mark)
// //         }
// //       }
// //       const nextNode = node.mark(nextMarks)
// //       nextNodes.push(nextNode)
// //     })

// //     state.tr.

// //     const mark = marks.find(markItem => markItem.type.name === type.name)

// //     if (mark) {
// //       return mark.attrs
// //     }

// //     return {}

// //     // const { from, to } = state.selection
// //     // return dispatch(state.tr.addMark(from, to, type.create(attrs)))
// //   }
// // }
