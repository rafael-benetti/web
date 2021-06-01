import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 } from 'uuid';
import Button from '../components/button';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import SingleCategory from '../components/single-category';
import { useCategory } from '../hooks/category';
import { useUser } from '../hooks/user';
import { InputContainer } from '../styles/components/input';
import {
  CategoriesContainer,
  CategoriesContent,
  Table,
} from '../styles/pages/categories';
import { PageTitle } from '../utils/page-title';

const CategoriesPage: React.FC = () => {
  // hooks
  const { getCategories, categories } = useCategory();
  const { user } = useUser();
  // state
  const [filter, setFilter] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getCategories();
      setBusy(false);
    })();
  }, []);

  return (
    <Container active="categories" loading={busy}>
      <CategoriesContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Categorias</h1>
            <CurrentPath
              path={[{ name: 'home', url: '/' }, { name: 'Categorias' }]}
            />
          </div>
          {user?.permissions?.createCategories || user?.role === 'OWNER' ? (
            <Link to="/editar-categoria">
              <Button title="Nova Categoria" color="primary" />
            </Link>
          ) : null}
        </PageTitle>
        <CategoriesContent>
          <div className="filter">
            <InputContainer isFocused={isFocused}>
              <label htmlFor="category-name">
                <p>Pesquisar</p>
                <div>
                  <input
                    onFocus={() => {
                      setIsFocused(true);
                    }}
                    onBlur={() => {
                      setIsFocused(false);
                    }}
                    id="category-name"
                    onChange={e => {
                      setFilter(e.target.value);
                    }}
                  />
                </div>
              </label>
            </InputContainer>
          </div>
          <Table>
            <div className="table-title">
              <h1 className="table-title-font category-name">Nome</h1>
            </div>
            {categories &&
              categories.map(category => {
                if (filter) {
                  if (
                    category.label.toLowerCase().includes(filter.toLowerCase())
                  ) {
                    const temp = category;
                    return (
                      <SingleCategory key={v4()} data={temp} user={user} />
                    );
                  }
                  return null;
                }
                return (
                  <SingleCategory key={v4()} data={category} user={user} />
                );
              })}
          </Table>
        </CategoriesContent>
      </CategoriesContainer>
    </Container>
  );
};
export default CategoriesPage;
