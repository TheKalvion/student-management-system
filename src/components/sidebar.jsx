
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">S</div>
        <h2>StudentPro</h2>
      </div>

      <p className="menu-label">MAIN MENU</p>

      <nav className="sidebar-nav">
        <a href="#dashboard" className="nav-link active">
          <span>▦</span>
          Dashboard
        </a>

        <a href="#students" className="nav-link">
          <span>♙</span>
          Students
        </a>

        <a href="#add-student" className="nav-link">
          <span>＋</span>
          Add Student
        </a>
      </nav>

      <div className="sidebar-bottom">
        <p>Student Management System</p>
        <span>Version 1.0</span>
      </div>
    </aside>
  );
}

export default Sidebar;
