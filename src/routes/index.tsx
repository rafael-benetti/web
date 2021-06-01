import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './route';

import Dashboard from '../pages/dashboard';
import LoginPage from '../pages/login';
import GroupsPage from '../pages/groups';
import PointsOfSalePage from '../pages/points-of-sale';
import CreateEditPointOfSalePage from '../pages/handle-point-of-sale';
import ManagersPage from '../pages/managers';
import HandleManagerPage from '../pages/handle-manager';
import ProfilePage from '../pages/profile';
import CategoriesPage from '../pages/categories';
import HandleCategoryPage from '../pages/handle-category';
import MachinesPage from '../pages/machines';
import HandleMachinePage from '../pages/handle-machine';
import StockPage from '../pages/stock';
import PersonalStockPage from '../pages/personal-stock';
import CounterTypesPage from '../pages/counter-types';
import OperatorRoutesPages from '../pages/operator-routes';
import TelemetriesPage from '../pages/telemetries';
import OperatorsPage from '../pages/operators';
import HandleOperatorPage from '../pages/handle-operator';
import CollectionsPage from '../pages/collections';
import CreateCollectionPage from '../pages/create-collection';
import CollectionInfo from '../pages/collection-info';
import MachineInfoPage from '../pages/machine-info';
import PointOfSaleInfo from '../pages/point-of-sale-info';
import RouteInfo from '../pages/route-info';
import TelemetryLogsPage from '../pages/telemetry-logs';
import GroupInfoPage from '../pages/group-info';
import NotificationsPage from '../pages/notifications';
import MachineEventsLogs from '../pages/machine-events-log';
import ReportPage from '../pages/reports';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" isPrivate={false} exact component={LoginPage} />

    <Route path="/dashboard" isPrivate exact component={Dashboard} />

    <Route path="/machines" isPrivate exact component={MachinesPage} />

    <Route
      path="/categories"
      isPrivate
      except="OPERATOR"
      exact
      component={CategoriesPage}
    />

    <Route path="/collections" isPrivate exact component={CollectionsPage} />

    <Route path="/telemetries" isPrivate exact component={TelemetriesPage} />

    <Route
      path="/group-stock"
      isPrivate
      except="OPERATOR"
      exact
      component={StockPage}
    />

    <Route
      path="/personal-stock"
      isPrivate
      except="OWNER"
      exact
      component={PersonalStockPage}
    />

    <Route
      path="/points-of-sale"
      isPrivate
      exact
      component={PointsOfSalePage}
    />

    <Route path="/routes" isPrivate exact component={OperatorRoutesPages} />

    <Route
      path="/groups"
      isPrivate
      except="OPERATOR"
      exact
      component={GroupsPage}
    />

    <Route
      path="/handle-point-of-sale"
      isPrivate
      exact
      component={CreateEditPointOfSalePage}
    />

    <Route
      path="/managers"
      isPrivate
      exact
      except="OPERATOR"
      permission={['LIST_MANAGERS', 'OWNER']}
      component={ManagersPage}
    />

    <Route
      path="/operators"
      isPrivate
      exact
      except="OPERATOR"
      permission={['LIST_OPERATORS', 'OWNER']}
      component={OperatorsPage}
    />

    <Route
      path="/relatorio"
      isPrivate
      except="OPERATOR"
      permission={['GENERATE_REPORTS', 'OWNER']}
      exact
      component={ReportPage}
    />

    <Route path="/profile" isPrivate exact component={ProfilePage} />

    <Route
      path="/handle-manager"
      isPrivate
      exact
      component={HandleManagerPage}
    />
    <Route
      path="/handle-operator"
      isPrivate
      exact
      component={HandleOperatorPage}
    />

    <Route
      path="/handle-category"
      isPrivate
      exact
      component={HandleCategoryPage}
    />

    <Route
      path="/counter-types"
      isPrivate
      except="OPERATOR"
      exact
      component={CounterTypesPage}
    />
    <Route
      path="/handle-machine"
      isPrivate
      exact
      component={HandleMachinePage}
    />

    <Route
      path="/create-collection"
      isPrivate
      exact
      component={CreateCollectionPage}
    />
    <Route path="/collection-info" isPrivate exact component={CollectionInfo} />
    <Route path="/single-machine" isPrivate exact component={MachineInfoPage} />
    <Route
      path="/single-point-of-sale"
      isPrivate
      exact
      component={PointOfSaleInfo}
    />
    <Route path="/single-route" isPrivate exact component={RouteInfo} />
    <Route
      path="/historico-de-eventos"
      isPrivate
      exact
      component={TelemetryLogsPage}
    />
    <Route
      path="/detalhes-da-parceria"
      isPrivate
      exact
      component={GroupInfoPage}
    />
    <Route path="/notificacoes" isPrivate exact component={NotificationsPage} />
    <Route
      path="/historico-de-eventos-da-maquina"
      isPrivate
      exact
      component={MachineEventsLogs}
    />
  </Switch>
);

export default Routes;
