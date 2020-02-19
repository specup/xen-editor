import { FC } from 'react'
import ReactDOM from 'react-dom'

// TODO: material-ui dialog로 교체되면 필요 없어질 컴포넌트
const Portal: FC = ({ children }) => {
  return ReactDOM.createPortal(children, document.body)
}

export default Portal
