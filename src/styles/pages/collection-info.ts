import styled from 'styled-components';

export const CollectionInfoContainer = styled.div`
  min-height: calc(100vh - 7rem);
  width: 100%;
  padding: 2.5rem;
  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;

export const CollectionInfoContent = styled.div`
  width: 100%;
  margin-top: 3rem;
  padding: 5rem;
  background-color: #fff;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  display: flex;
  flex-direction: column;
  .observation {
    padding: 2rem;
    width: 100%;
    background-color: #fff;
    border-radius: 1.5rem;
    -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
    box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
    margin-top: 2rem;
    h1 {
      margin-bottom: 2rem;
    }
  }
  .photos {
    padding: 2rem;
    width: 100%;
    background-color: #fff;
    border-radius: 1.5rem;
    -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
    box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
    margin-top: 2rem;
    h1 {
      margin-bottom: 2rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 2rem;
    }
  }
  @media screen and (max-width: 37.5em) {
    padding: 3rem 1.5rem;
    .filter {
      width: 100%;
    }
    .photos {
      .grid {
        grid-template-columns: repeat(1, 1fr);
      }
    }
  }
  @media screen and (max-width: 56.25em) {
    .photos {
      .grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
`;

export const ReviewCollection = styled.div`
  margin-bottom: 2rem;
  span {
    padding: 1rem;
    background-color: #4b8b3b;
    color: #fff;
    border-radius: 3px;
  }
`;

export const DateInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  .date-data {
    padding: 2rem;
    width: 100%;
    background-color: #fff;
    border-radius: 1.5rem;
    -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
    box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .grid {
      width: 100%;
      margin-top: 1.5rem;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1rem;
      div {
        label {
          width: 100%;
          div {
            margin: 0;
            input {
              margin: 0;
            }
          }
        }
        &:not(:last-child) {
          margin-right: 2rem;
        }
      }
    }
    &:not(:last-child) {
      margin-right: 1.5rem;
    }
  }
  @media screen and (max-width: 37.5em) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    div {
      &:not(:first-child) {
        margin-top: 2rem;
      }
    }
  }
`;

export const CollectionData = styled.div`
  margin-top: 2rem;
`;

export const Table = styled.div`
  .table-title {
    background: rgba(115, 102, 255, 0.1);
    padding: 1rem;
    border-right: 1px solid #9999;
    border-left: 1px solid #9999;
    border-bottom: 1px solid #9999;
  }
  .primary-row {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, minmax(100px, 1fr));
    grid-template-rows: min-content;
    text-align: start;
    padding: 1.5rem;
    border-bottom: 1px solid #9999;
    .center {
      text-align: center;
    }
  }
`;

export const SingleCollectionInfo = styled.div`
  display: flex;
  .counter {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    border-right: 1px solid #9999;
    border-left: 1px solid #9999;
    border-bottom: 1px solid #9999;
    background-color: rgba(245, 247, 250, 0.5);
  }
  .numbers {
    flex: 5;
    .row {
      display: grid;
      grid-template-columns: repeat(4, minmax(100px, 1fr));
      grid-template-rows: min-content;
      grid-auto-rows: min-content;
      &:nth-of-type(odd) {
        background-color: rgba(245, 247, 250, 0.5);
      }
      &:hover {
        background-color: rgba(115, 102, 255, 0.1);
      }
      .center {
        text-align: center;
      }
      div {
        padding: 1.5rem;
        border-bottom: 1px solid #9999;
      }
    }
  }
`;

export const Gallery = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  .images {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    .photo {
      position: relative;
      button {
        border: none;
        border-radius: 0.5rem;
        background-color: inherit;
        margin-left: 2rem;
      }
      img {
        width: 8rem;
        height: 8rem;
        border-radius: 0.5rem;
        object-fit: cover;
      }
      .delete-btn {
        position: absolute;
        bottom: 0;
        right: 0;
        background-color: #fff;
        z-index: 30;
        padding: 0.5rem;
      }
    }
  }
`;

export const Photo = styled.div`
  padding: 2rem;
  h1 {
    font-size: 1.8rem;
  }
  label {
    .addPhotos {
      width: 8rem;
      height: 8rem;
      border-radius: 0.5rem;
      background-color: inherit;
      border: 1px dotted #bbb;
      margin-top: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 3rem;
        height: 3rem;
        color: #00161d;
        opacity: 0.7;
      }
    }
    input {
      display: none;
    }
    &:hover {
      cursor: pointer;
    }
  }
`;

export const MapCollection = styled.div`
  width: 100%;
  height: 50vh;
`;
