import Menu from '@/components/menu';
import {ApiProvider} from '@emran/Context/APIContext';
import '.././globals.css';
import AuthGuard from '@auth/AuthGuard';


export const metadata = {
  title: 'Emdad English Aid',
  description: 'English Private program for HSC, Academic  and Admission',
};

export default function RootLayout({children}) {

  return (
    <html lang="en">
    <body
      className="leading-normal tracking-normal bg-cover bg-fixed min-h-screen"
      style={{backgroundImage: 'url(/assets/image/header.png)'}}>
    <AuthGuard>
      <ApiProvider>
        <div className="w-full">
          <Menu />
          <div className="w-full">
            <div className="w-full px-6 py-4">{children}</div>
          </div>
        </div>
      </ApiProvider>
    </AuthGuard>
    </body>
    </html>
  );
}
