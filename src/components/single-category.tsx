import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../entiti/category';
import { User } from '../entiti/user';
import { SingleCategoryContainer } from '../styles/components/single-category';

interface Props {
  data: Category;
  user?: User;
}

const SingleCategory: React.FC<Props> = ({ data, user }) => {
  return (
    <SingleCategoryContainer>
      <Link
        to={{
          pathname: `${
            user?.permissions?.editCategories || user?.role === 'OWNER'
              ? '/editar-categoria'
              : '/categorias'
          }`,
          state: data,
        }}
      >
        <button type="button" className="edit-btn">
          <h1 className="category-label" style={{ textAlign: 'start' }}>
            {data.label}
          </h1>
        </button>
      </Link>
    </SingleCategoryContainer>
  );
};
export default SingleCategory;
