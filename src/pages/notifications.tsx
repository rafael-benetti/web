import React, { useCallback, useEffect, useState } from 'react';
import { Pagination } from '@material-ui/lab';
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import ptLocale from 'date-fns/locale/pt-BR';
import { Link } from 'react-router-dom';
import Container from '../components/container';
import CurrentPath from '../components/current-path';
import { useUser } from '../hooks/user';
import {
  NotificationsContainer,
  NotificationsContent,
  PaginationContainer,
  SingleNotifications,
  Table,
} from '../styles/pages/notifications';
import { PageTitle } from '../utils/page-title';

const NotificationsPage: React.FC = () => {
  // hooks
  const { getNotifications, notifications, count } = useUser();

  // state
  const [busy, setBusy] = useState<boolean>(false);
  const [pageSelected, setPageSelected] = useState<number>(1);

  const numberOfPages = useCallback((num: number) => {
    return Math.ceil(num / 10);
  }, []);

  useEffect(() => {
    setBusy(true);
    (async () => {
      await getNotifications(pageSelected * 10 - 10);
      setBusy(false);
    })();
  }, [pageSelected]);

  return (
    <Container active="points-of-sale" loading={busy}>
      <NotificationsContainer>
        <PageTitle>
          <div className="title-nav">
            <h1 className="heading-font">Notificações</h1>
            <CurrentPath
              path={[{ name: 'home', url: '/' }, { name: 'Notificações' }]}
            />
          </div>
        </PageTitle>
        <NotificationsContent>
          <Table>
            <div className="table-title">
              <h1 className="table-title-font partnerships-name">
                Notificações
              </h1>
            </div>
            <div className="primary-row table-title-font">
              <div className="label">Título</div>

              <div className="route">Descrição</div>
              <div className="contact-name">Data</div>
            </div>
            {notifications.map(notification => {
              return (
                <SingleNotifications>
                  <Link
                    to={{
                      pathname: 'single-machine',
                      state: notification.machineId,
                    }}
                  >
                    <div className="row">
                      <div className="contact-name">{notification.title}</div>
                      <div className="contact-name">{notification.body}</div>
                      <div className="phone">
                        {format(
                          new Date(notification.date),
                          `dd'-'MM'-'yy 'às' H:mm`,
                          {
                            locale: ptLocale,
                          },
                        )}
                      </div>
                    </div>
                  </Link>
                </SingleNotifications>
              );
            })}
          </Table>
          <PaginationContainer>
            <Pagination
              count={numberOfPages(count || 0)}
              color="primary"
              variant="outlined"
              page={pageSelected}
              onChange={(event, page) => {
                setPageSelected(page);
              }}
            />
          </PaginationContainer>
        </NotificationsContent>
      </NotificationsContainer>
    </Container>
  );
};
export default NotificationsPage;
