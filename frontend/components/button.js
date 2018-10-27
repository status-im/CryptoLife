import styled, { css } from "styled-components";

const Button = styled.button`
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.13em;
  max-width: 40vw;
  background: none;
  color: white;
  border: 2px solid #e01c6b;
  box-sizing: border-box; /* Button Shadow 1 */
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
  border-radius: 30px;
  outline: none;
  cursor: pointer;
  padding: 8px 20px;
  transition: 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  a {
    color: white;
  }
  :hover {
    background-color: #e01c6b;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
    transform: translateY(-3px);
  }
  ${props =>
    props.primary &&
    css`
      font-size: 1.5rem;
      text-transform: uppercase;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 15px;
      @media (max-width: 640px) {
        font-size: 1rem;
      }
    `};
  ${props =>
    props.light &&
    css`
      border-color: white;
      color: white;
    `};
`;
export default Button;
