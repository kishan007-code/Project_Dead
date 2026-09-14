import AppShell from "./components/layout/AppShell";
import Home from "./pages/Home/Home";
import Semester from "./pages/Semester/Semester";
import SemesterResource from "./pages/SemesterResource/SemesterResource";
import Notices from "./pages/Notices/Notices";
import NoticePopup from "./components/notices/NoticePopup";
import UnderConstruction from "./pages/UnderConstruction/UnderConstruction";

function App() {
    const path = window.location.pathname;

    let page = <Home />;

    if (path === "/semester") {
        page = <Semester />;
    } else if (path.startsWith("/semester/")) {
        page = <SemesterResource />;
    } else if (path === "/notices") {
        page = <Notices />;
    } else if (path === "/tools" || path === "/about") {
        page = <UnderConstruction />;
    }

    return (
        <AppShell>
            <NoticePopup />
            {page}
        </AppShell>
    );
}

export default App;