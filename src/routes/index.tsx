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
import ForgotPasswordPage from '../pages/forgot-password';
import ChangePasswordPage from '../pages/change-password';
import InventoryPage from '../pages/inventory';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" isPrivate={false} exact component={LoginPage} />

    <Route
      path="/recuperar-senha"
      isPrivate={false}
      exact
      component={ForgotPasswordPage}
    />

    <Route
      path="/email-confirmado"
      isPrivate={false}
      exact
      component={ChangePasswordPage}
    />

    <Route path="/dashboard" isPrivate exact component={Dashboard} />

    <Route path="/maquinas" isPrivate exact component={MachinesPage} />

    <Route
      path="/categorias"
      isPrivate
      except="OPERATOR"
      exact
      component={CategoriesPage}
    />

    <Route path="/coletas" isPrivate exact component={CollectionsPage} />

    <Route path="/telemetrias" isPrivate exact component={TelemetriesPage} />

    <Route
      path="/estoque-da-parceria"
      isPrivate
      except="OPERATOR"
      exact
      component={StockPage}
    />

    <Route
      path="/estoque-pessoal"
      isPrivate
      except="OWNER"
      exact
      component={PersonalStockPage}
    />

    <Route
      path="/pontos-de-venda"
      isPrivate
      exact
      component={PointsOfSalePage}
    />

    <Route path="/rotas" isPrivate exact component={OperatorRoutesPages} />

    <Route
      path="/parcerias"
      isPrivate
      except="OPERATOR"
      exact
      component={GroupsPage}
    />

    <Route
      path="/editar-ponto-de-venda"
      isPrivate
      exact
      component={CreateEditPointOfSalePage}
    />

    <Route
      path="/colaboradores"
      isPrivate
      exact
      except="OPERATOR"
      permission={['LIST_MANAGERS', 'OWNER']}
      component={ManagersPage}
    />

    <Route
      path="/operadores"
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

    <Route path="/perfil" isPrivate exact component={ProfilePage} />

    <Route
      path="/editar-colaborador"
      isPrivate
      exact
      component={HandleManagerPage}
    />
    <Route
      path="/editar-operador"
      isPrivate
      exact
      component={HandleOperatorPage}
    />

    <Route
      path="/editar-categoria"
      isPrivate
      exact
      component={HandleCategoryPage}
    />

    <Route
      path="/tipos-de-contadores"
      isPrivate
      except="OPERATOR"
      exact
      component={CounterTypesPage}
    />
    <Route
      path="/editar-maquina"
      isPrivate
      exact
      component={HandleMachinePage}
    />

    <Route
      path="/criar-coleta"
      isPrivate
      exact
      component={CreateCollectionPage}
    />
    <Route
      path="/detalhes-da-coleta"
      isPrivate
      exact
      component={CollectionInfo}
    />
    <Route
      path="/detalhes-da-maquina"
      isPrivate
      exact
      component={MachineInfoPage}
    />
    <Route
      path="/detalhes-do-ponto-de-venda"
      isPrivate
      exact
      component={PointOfSaleInfo}
    />
    <Route path="/detalhes-da-rota" isPrivate exact component={RouteInfo} />
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
    <Route path="/inventario" isPrivate exact component={InventoryPage} />
  </Switch>
);

export default Routes;
