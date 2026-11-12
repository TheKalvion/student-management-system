
function Header() {
  return (
    <header className="header">
      <div>
        <h2>Student Management</h2>
        <p>Manage your students in one place</p>
      </div>

      <div className="header-profile">
        <div className="profile-avatar">A</div>

        <div>
          <h4>Administrator</h4>
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
