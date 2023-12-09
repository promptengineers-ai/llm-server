/* eslint-disable jsx-a11y/anchor-is-valid */
interface Props {
    title: string;
    subtitles?: {name: string, href: string}[];
    icon?: string;
}

function SubItems(subtitles: {name: string, href: string}[]) {
    return (
        subtitles.map((subtitle, index) => (
            <li key={index}>
                <a href={subtitle.href}>{subtitle.name}</a>
            </li>
        ))
    );

}

export default function NavItem({ title, subtitles, icon }: Props) {
    return (
        <li className="sidebar-dropdown">
            <a href='#'>
                <i className={icon ? icon : "bi bi-house"}></i>
                <span className="menu-text">{title || 'Title Here'}</span>
            </a>
            {subtitles && subtitles.length > 0 && (
                <div className="sidebar-submenu" style={{ display: 'none' }}>
                    <ul>
                        {SubItems(subtitles)}
                    </ul>
                </div>
            )}
        </li>
    );
}