import React from 'react';
import { AuthProvider } from './auth';
import { CategoryProvider } from './category';
import { CollectionProvider } from './collection';
import { ErrorProvider } from './error';
import { GroupProvider } from './group';
import { MachineProvider } from './machine';
import { ManagerProvider } from './manager';
import { ModalProvider } from './modal';
import { OperatorProvider } from './operator';
import { PointOfSaleProvider } from './point-of-sale';
import { ReportProvider } from './report';
import { RouteProvider } from './route';
import { StockProvider } from './stock';
import { TelemetryProvider } from './telemetry';
import { ToastProvider } from './toast';
import { UserProvider } from './user';
import { UtilsProvider } from './utils';

const AppProvider: React.FC = ({ children }) => (
  <ToastProvider>
    <ErrorProvider>
      <ModalProvider>
        <AuthProvider>
          <UserProvider>
            <UtilsProvider>
              <ReportProvider>
                <ManagerProvider>
                  <OperatorProvider>
                    <GroupProvider>
                      <CategoryProvider>
                        <PointOfSaleProvider>
                          <MachineProvider>
                            <StockProvider>
                              <RouteProvider>
                                <TelemetryProvider>
                                  <CollectionProvider>
                                    {children}
                                  </CollectionProvider>
                                </TelemetryProvider>
                              </RouteProvider>
                            </StockProvider>
                          </MachineProvider>
                        </PointOfSaleProvider>
                      </CategoryProvider>
                    </GroupProvider>
                  </OperatorProvider>
                </ManagerProvider>
              </ReportProvider>
            </UtilsProvider>
          </UserProvider>
        </AuthProvider>
      </ModalProvider>
    </ErrorProvider>
  </ToastProvider>
);

export default AppProvider;
