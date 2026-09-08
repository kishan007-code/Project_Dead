/* =========================================================
   FWU NOTES - APPLICATION SHELL
   ---------------------------------------------------------
   AppShell provides the persistent structure shared by all
   pages of the application.
   ========================================================= */

import Navbar from "../navigation/Navbar";


function AppShell({ children }) {
    return (
        <div className="app-shell">

            <Navbar />

            <main className="app-shell__content">
                {children}
            </main>

            <footer className="app-shell__footer">
                <p>
                    FWU Notes · Engineering resources, all in one place.
                </p>
            </footer>

        </div>
    );
}


export default AppShell;