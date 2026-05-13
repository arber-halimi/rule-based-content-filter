import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand-block">
                    <div className="brand-icon">RF</div>

                    <div>
                        <h1>Rule-Based Content Filter</h1>
                        <p>Manage text rules and preview their visual output.</p>
                    </div>
                </div>

                <nav className="nav-links" aria-label="Primary navigation">
                    <NavLink to="/rules">
                        Rule Management
                    </NavLink>
                    <NavLink to="/processor">
                        Text Processing
                    </NavLink>
                </nav>

                <div className="sidebar-note">
                    <span>System Module</span>
                    <p>Content filtering rules and text processing operations.</p>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
