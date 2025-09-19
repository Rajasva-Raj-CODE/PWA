import PWAInstallButton from "../components/PWAInstallButton";
import PushNotificationButton from "../components/PushNotificationButton";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-6 max-w-xl text-center">
        <h1 className="text-2xl font-bold">Next.js PWA</h1>
        <p className="text-gray-600">Click the buttons below to install the PWA and enable notifications.</p>
        
        <div className="flex flex-col gap-4 w-full">
          <PWAInstallButton />
          <PushNotificationButton />
        </div>
      </div>
    </div>
  );
}
