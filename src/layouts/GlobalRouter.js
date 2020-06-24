import React from 'react'
import PropTypes from 'prop-types'
import CookieUtil from '@/utils/cookie'

// 全局路由管理
const GlobalRouter = props => {
  if (!CookieUtil.get('token_1')) {
    window.location.pathname = ''
    return null
  }
  return <>{props.children}</>
}

GlobalRouter.propTypes = {
  location: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
}

export default GlobalRouter
