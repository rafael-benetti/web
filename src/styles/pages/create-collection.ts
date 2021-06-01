import styled from 'styled-components';

export const CreateCollectionContainer = styled.div`
  min-height: calc(100vh - 7rem);
  max-width: 100%;
  padding: 2.5rem;

  @media screen and (max-width: 37.5em) {
    padding: 2.5rem 0;
  }
`;

export const CreateCollectionContent = styled.div`
  max-width: 100%;
  margin-top: 3rem;
  padding: 5rem;
  background-color: #fff;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 3.7rem rgba(115, 102, 255, 0.1);
  padding: 3rem 1.5rem;
  .machine-id-hidden {
    display: none;
  }
  .observation {
    padding: 2rem;
  }
  .submit-button {
    width: 100%;
    text-align: right;
    padding: 2rem;
    a {
      margin-right: 2rem;
    }
  }
  .stock {
    h1 {
      margin-bottom: 2rem;
      font-size: 1.8rem;
    }
    .count-prize {
      p {
        line-height: 1.5;
        margin-bottom: 1rem;
      }
      margin-bottom: 2rem;
    }
  }
`;

export const CollectType = styled.div`
  padding: 3rem;
  background-color: #fff;
  border-radius: 1.5rem;
  -webkit-box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  box-shadow: 0 0 0.5rem rgba(115, 102, 255, 0.1);
  margin-bottom: 3rem;
  .title {
    h1 {
      font-size: 2rem;
    }
    margin-bottom: 2rem;
  }
  .inputs {
    .box-id-hidden {
      display: none;
    }
    .counter-id-hidden {
      display: none;
    }
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 3rem;
    div {
      label {
        p {
          font-weight: 500;
        }
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
        color: #7366ff;
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
