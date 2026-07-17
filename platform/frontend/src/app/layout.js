import './styles/globals.css';

export const metadata = {
  title: 'MainStreet AI — Small Business AI Assistant',
  description: 'Deploy intelligent AI agents for your small business. Website chatbots, phone receptionists, and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
