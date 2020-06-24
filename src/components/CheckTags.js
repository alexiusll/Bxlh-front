import React from 'react'
import PropTypes from 'prop-types'
import { Tag } from 'antd'

const { CheckableTag } = Tag

export default class CheckTags extends React.Component {
  state = {
    checkedItem: -1
  }

  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    handleChange: PropTypes.func.isRequired,
    itemList: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.number
      }).isRequired
    ),
    children: PropTypes.node
  }

  UNSAFE_componentWillReceiveProps(nextProp) {
    const { id, defaultValue } = this.props

    if (id !== undefined) {
      this.setState({
        checkedItem: id
      })
    }
    if (defaultValue !== nextProp.defaultValue) {
      this.setState({
        checkedItem: nextProp.defaultValue
      })
    }
  }

  handleChange(id) {
    this.setState({
      checkedItem: id
    })
    if (id !== -1) {
      this.props.handleChange(id)
    } else {
      this.props.handleChange(null)
    }
  }

  render() {
    const { itemList = [] } = this.props

    /**
     *  id
     *  name
     */
    return (
      <div>
        {itemList.map((item, index) => {
          const { id, name } = item

          return (
            <CheckableTag
              style={{ fontSize: 14 }}
              key={index}
              checked={this.state.checkedItem === id}
              onChange={() => this.handleChange(id)}
            >
              {name}
            </CheckableTag>
          )
        })}
        {this.props.children}
      </div>
    )
  }
}
