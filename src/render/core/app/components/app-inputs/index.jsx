import React from 'react'
import PropTypes from 'prop-types'

export default class Input extends React.PureComponent {
  constructor (props) {
    super(props)
    this.ref = null
  }

  static get defaultProps () {
    return {
      type: 'text',
      autoComplete: 'off'
    }
  }

  static get propTypes () {
    return {
      placeholder: PropTypes.string.isRequired
    }
  }

  handleInput = (e) => {
    // If handler
    if (this.props.onInput) this.props.onInput(e)
    e.target.classList.remove('invalid')
  }

  handleChange = (e) => {
    // If handler
    if (this.props.onChange) { this.props.onChange(e) }
  }

  handleKeyDown = (e) => {
    // If handler
    if (this.props.onKeyDown) { this.props.onKeyDown(e) }
  }

  handleInvalid = (e) => {
    e.preventDefault()
    e.target.classList.add('invalid')
  }

  getRef = (ref) => {
    this.ref = ref
  }

  render () {
    return (
      <div>
        {this.props.icon && <i className={this.props.icon + ' gray-text'} />}
        <input
          {...this.props}
          onInput={this.handleInput}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onInvalid={this.handleInvalid}
          ref={this.getRef}
          className='white-text validate'
        />
      </div>
    )
  }
}
