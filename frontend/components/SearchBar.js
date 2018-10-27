import React, { PureComponent } from 'react'
import styled from 'styled-components'

const SearchIcon = props => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      width="15.7434"
      height="15.5"
      fill="black"
      fillOpacity="0"
      transform="translate(0.183716 0.75)"
    />
    <path
      opacity="0.54"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.3526 9.79166H9.83179L9.65074 9.6147C10.2903 8.88039 10.6793 7.92843 10.6793 6.88541C10.6793 4.56687 8.77042 2.68749 6.41546 2.68749C4.0605 2.68749 2.15161 4.56687 2.15161 6.88541C2.15161 9.20395 4.0605 11.0833 6.41546 11.0833C7.47486 11.0833 8.44112 10.701 9.18696 10.072L9.36801 10.2489V10.7604L12.6466 13.9838L13.6246 13.0208L10.3526 9.79166ZM6.4154 9.79168C4.78464 9.79168 3.4635 8.49097 3.4635 6.88543C3.4635 5.28054 4.78464 3.97918 6.4154 3.97918C8.0455 3.97918 9.36729 5.28054 9.36729 6.88543C9.36729 8.49097 8.0455 9.79168 6.4154 9.79168Z"
      fill="black"
    />
  </svg>
)

const Input = styled.input`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  border: 1px solid white;
  border-radius: 3px;
  padding-left: 0.25rem;
  width: 100%;
  font-size: 20px;
  &:focus {
    outline: none;
  }

  @media (max-width: 640px) {
    max-width: 120px;
  }
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  padding: 0.75rem;
  border-radius: 6px;
  min-width: 300px;
  max-width: 900px;
`

export default class SearchBar extends PureComponent {
  render() {
    return (
      <Wrapper>
        <SearchIcon style={{ width: '20px', height: '20px' }} />
        <Input
          onChange={this.props.onChange}
          onKeyDown={this.props.onKeyDown}
          placeholder="address.eth or 0x01010101010..."
        />
      </Wrapper>
    )
  }
}
