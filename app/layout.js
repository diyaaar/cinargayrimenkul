import './globals.css';

export const metadata = {
    title: 'Çınar Gayrimenkul - Çiğli İzmir Premium Gayrimenkul Danışmanlığı',
    description: 'Çiğli ve İzmir genelinde prestijli gayrimenkul danışmanlığı. 7+ yıllık deneyim ile konut, ticari, arsa satış ve kiralama hizmetleri.',
    icons: {
        icon: '/favicon.svg',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="tr">
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
