import AuthProvider from "./AuthProvider";
import { TwoFAModalProvider } from "./TwoFAModalProvider";
import { SocketProvider } from "./SocketProvider";
import { NotificationProvider } from "./NotificationProvider";
import { NotificationProvider as ToastNotificationProvider } from "../components/shared/NotificationSystem";
import { RatingProvider } from "./RatingProvider";
import { IvyWayAIProvider } from "../contexts/IvyWayAIContext";
import SmartStripeProvider from "./SmartStripeProvider";
// Import other providers...

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <TwoFAModalProvider>
        <SocketProvider>
          <NotificationProvider>
            <RatingProvider>
              <SmartStripeProvider>
                <IvyWayAIProvider>
                  <ToastNotificationProvider>
                    {children}
                  </ToastNotificationProvider>
                </IvyWayAIProvider>
              </SmartStripeProvider>
            </RatingProvider>
          </NotificationProvider>
        </SocketProvider>
      </TwoFAModalProvider>
    </AuthProvider>
    // If you have providers that need socket, put them inside SocketProvider
  );
}
