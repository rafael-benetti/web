import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

*{
  margin: 0;
  padding:0;
  box-sizing: border-box ;
  }

  :root{
    --color-primary: #00161d;
  }

  html {
    font-size: 62.5%;
  @media screen and (max-width: 87.5em) {       //1400px  //1rem = 9px, 9/16 = 52.25%
    font-size: 52.25%;
  }
  @media screen and (max-width: 75em) {       //1200px  //1rem = 9px, 9/16 = 52.25%
    font-size: 52.25%;
  }
  @media screen and (max-width: 56.25em) {     //900px  //1rem = 8px, 8/16 = 50%
    font-size: 50%;
  }
  /* @media screen and (max-width: 37.5em) {    //600px
    padding: 100px;
  } */
  /* @media screen and (min-width: 112.5em) {    //1800 px //1rem = 12px, 12/16 = 75%
    font-size: 75%;

  } */
  }


  body{
    -webkit-font-smoothing: antialiased;
    background: #fff;

  }

  body, input, button, h1, h2, h3, h4, p, tr, th{
    font-family: Rubik, sans-serif;
    color: #2b2b2b;
    line-height: 1.5;
    font-size: 1.4rem;
    letter-spacing: 0.5px;
    font-weight: 400;
    line-height: 1.2;
  }

  .btn-font {
    color: #FFF;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    line-height: 1.5;
    font-size: 1.4rem;
  }

  .heading-font {
    font-size: 2.4rem;
    font-weight: 500;
    text-transform: capitalize;
  }
  .heading-secondary-font {
    font-size: 1.5rem;
    font-weight: 500;
  }
  .table-title-font {
    line-height: 1.5;
    font-weight: 500;
    text-overflow: ellipsis;
  }
  .table-content-font {
    vertical-align: middle;
  }
  .side-bar-primary-font {
    font-weight: 500;
  }
  .side-bar-secondary-font {
    font-size: 1.4rem;
  }
  .label-font {
    line-height: 1.5;
    text-align: left;
  }

  #root {
    margin: 0;
  }

  button{
    cursor: pointer;
  }
`;
