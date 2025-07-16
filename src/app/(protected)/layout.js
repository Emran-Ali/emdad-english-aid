import Menu from '@/components/menu';
import {ApiProvider} from '@emran/Context/APIContext';
import localFont from 'next/font/local';
import '.././globals.css';

const geistSans = localFont({
  src: '.././fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: '.././fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata = {
  title: 'Emddad English Aid',
  description: 'English Private program for HSC, accademic , and Admission',
};

export default function RootLayout({children}) {
  return (
    <html lang='en'>
      <body
        className='leading-normal tracking-normal bg-cover bg-fixed min-h-screen'
        style={{backgroundImage: 'url(/assets/image/header.png)'}}>
        <ApiProvider>
          <div className='w-full'>
            <Menu />
            <div className='w-full'>
              <div className='w-full px-6 py-4'>{children}</div>
            </div>
          </div>
        </ApiProvider>
      </body>
    </html>
  );
}
