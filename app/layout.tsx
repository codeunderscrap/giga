import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'GigaMines — Critical minerals. Renewed potential.',description:'A Mini Mines vertical. An integrated refining vision for critical minerals and rare earth elements.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
