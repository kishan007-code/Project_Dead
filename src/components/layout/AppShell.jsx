import Navbar from "../navigation/Navbar";
import Footer from "../Footer";

function AppShell({ children }) {
    return (
        <div className="app-shell">
            <Navbar />

            <main className="app-shell__content">
                {children}
            </main>

            <Footer />
        </div>
    );
}

export default AppShell;